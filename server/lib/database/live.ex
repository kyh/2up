defmodule Database.Live do
  use Database.Context
  alias Database.Authorization

  def play_create(%Pack{} = pack, attrs) do
    %Play{}
    |> Play.changeset(attrs)
    |> Ecto.Changeset.put_assoc(:pack, pack)
    |> Repo.insert()
  end

  def pack_list(%{username: username, tags: tags}) do
    user = Repo.get_by(User, username: username)

    case user do
      nil ->
        []

      _ ->
        query =
          from pack in Pack,
            join: pack_tag in PackTag,
            join: tag in Tag,
            where: pack.user_id == ^user.id,
            where: tag.name in ^tags

        Repo.all(query)
    end
  end

  def pack_list(%{username: username}) do
    user = Repo.get_by(User, username: username)

    case user do
      nil ->
        []

      _ ->
        query =
          from pack in Pack,
            where: pack.user_id == ^user.id

        Repo.all(query)
    end
  end

  def pack_list(%{tags: tags}) do
    query =
      from pack in Pack,
        join: pack_tag in PackTag,
        join: tag in Tag,
        where: tag.name in ^tags

    Repo.all(query)
  end

  def pack_list(_) do
    Repo.all(Pack)
  end

  def pack_get(name) do
    Repo.get_by(Pack, name: name)
  end

  def pack_get_by_id(id) do
    Repo.get_by(Pack, id: id)
  end

  def generate_code do
    :io_lib.format("~4..0B", [:rand.uniform(10_000) - 1])
    |> List.to_string()
  end

  def tag_create(attrs) do
    %Tag{}
    |> Tag.changeset(attrs)
    |> Repo.insert()
  end

  def pack_sync(pack, tags) do
    Enum.each(tags, fn tag_name ->
      tag =
        case Repo.get_by(Tag, %{name: tag_name}) do
          nil ->
            %Tag{}
            |> Tag.changeset(%{name: tag_name})
            |> Repo.insert!()

          existing_tag ->
            existing_tag
        end

      existing_pack_tag = Repo.get_by(PackTag, %{tag_id: tag.id, pack_id: pack.id})

      if is_nil(existing_pack_tag) do
        %PackTag{}
        |> PackTag.changeset(%{})
        |> Ecto.Changeset.put_assoc(:pack, pack)
        |> Ecto.Changeset.put_assoc(:tag, tag)
        |> Repo.insert()
      end
    end)

    query =
      from pack_tag in PackTag,
        join: tag in Tag,
        on: pack_tag.tag_id == tag.id,
        where: pack_tag.pack_id == ^pack.id,
        where: tag.name not in ^tags

    query |> Repo.delete_all()

    {:ok, pack}
  end

  def pack_create(%User{} = user, attrs) do
    %{tags: tags} = attrs

    %Pack{}
    |> Pack.changeset(attrs)
    |> Ecto.Changeset.put_assoc(:user, user)
    |> Repo.insert!()
    |> pack_sync(tags)
  end

  def pack_update(%User{} = user, attrs) do
    %{tags: tags} = attrs
    pack = Repo.get_by(Pack, id: attrs.id)

    with {:ok} <- Authorization.check(:pack_update, user, pack) do
      pack
      |> Pack.changeset(attrs)
      |> Repo.update!()
      |> pack_sync(tags)
    end
  end

  def pack_delete(%User{} = user, attrs) do
    pack = Repo.get_by(Pack, id: attrs.id)

    with {:ok} <- Authorization.check(:pack_asset_create, user, pack) do
      pack |> Repo.delete()
    end
  end

  def pack_tag_create(%Pack{} = pack, %Tag{} = tag) do
    %PackTag{}
    |> PackTag.changeset(%{})
    |> Ecto.Changeset.put_assoc(:pack, pack)
    |> Ecto.Changeset.put_assoc(:tag, tag)
    |> Repo.insert()
  end

  def rebalance_pack(%Pack{} = pack) do
    query =
      from scene in Scene,
        where: scene.pack_id == ^pack.id,
        order_by: [asc: scene.order]

    Repo.all(query) |> rebalance_scenes(10)
  end

  def rebalance_scenes([scene | scenes], new_order) do
    scene
    |> Scene.changeset(%{order: new_order})
    |> Repo.update()

    rebalance_scenes(scenes, new_order + 10)
  end

  def rebalance_scenes([], _order), do: :ok

  def pack_asset_list(args) do
    query =
      from pack_asset in PackAsset,
        where: pack_asset.pack_id == ^args.pack_id

    Repo.all(query)
  end

  def pack_tag_list(args) do
    query =
      from tag in Tag,
        join: pack_tag in PackTag,
        where: pack_tag.pack_id == ^args.pack_id

    Repo.all(query)
  end

  def pack_asset_create(%User{} = user, %Pack{} = pack, args) do
    with {:ok} <- Authorization.check(:pack_asset_create, user, pack) do
      %PackAsset{}
      |> PackAsset.changeset(%{raw_name: args.raw_name, path: args.path})
      |> Ecto.Changeset.put_assoc(:pack, pack)
      |> Repo.insert()
    end
  end

  def pack_asset_delete(%User{} = user, %PackAsset{} = pack, args) do
    with {:ok} <- Authorization.check(:pack_asset_delete, user, pack) do
      Repo.get_by(PackAsset, id: args.id)
      |> Repo.delete()
    end
  end
end

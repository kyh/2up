defmodule Database.Live do
  use Database.Context

  def play_create(%Pack{} = pack, attrs) do
    %Play{}
    |> Play.changeset(attrs)
    |> Ecto.Changeset.put_assoc(:pack, pack)
    |> Repo.insert()
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

  def pack_create(%User{} = user, attrs) do
    %Pack{}
    |> Pack.changeset(attrs)
    |> Ecto.Changeset.put_assoc(:user, user)
    |> Repo.insert()
  end

  def pack_update(%User{} = _user, attrs) do
    Repo.get_by(Pack, id: attrs.id)
    |> Pack.changeset(attrs)
    |> Repo.update()
  end

  def pack_tag_create(%Pack{} = pack, %Tag{} = tag) do
    %PackTag{}
    |> PackTag.changeset(%{})
    |> Ecto.Changeset.put_assoc(:pack, pack)
    |> Ecto.Changeset.put_assoc(:tag, tag)
    |> Repo.insert()
  end

  def tag_create(attrs) do
    %Tag{}
    |> Tag.changeset(attrs)
    |> Repo.insert()
  end

  def pack_scene_create(%Pack{} = pack, %Scene{} = scene, attrs) do
    %PackScene{}
    |> PackScene.changeset(attrs)
    |> Ecto.Changeset.put_assoc(:pack, pack)
    |> Ecto.Changeset.put_assoc(:scene, scene)
    |> Repo.insert()
  end

  def rebalance_pack(%Pack{} = pack) do
    query =
      from pack_scene in PackScene,
        where: pack_scene.pack_id == ^pack.id,
        order_by: [asc: pack_scene.order]

    Repo.all(query) |> rebalance_pack_scenes(10)
  end

  def rebalance_pack_scenes([pack_scene | pack_scenes], new_order) do
    pack_scene
    |> PackScene.changeset(%{order: new_order})
    |> Repo.update()

    rebalance_pack_scenes(pack_scenes, new_order + 10)
  end

  def rebalance_pack_scenes([], _order), do: :ok
end

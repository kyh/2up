defmodule Web.GraphQL.Resolvers.Catalog do
  alias Absinthe.Relay.Connection
  alias Database.Catalog
  alias Web.GraphQL.Errors

  def ordered_scene_list(_, args, _) do
    Connection.from_list(Catalog.ordered_scene_list(args), args)
  end

  def scene_answer_list(_, args, _) do
    {:ok, Catalog.scene_answer_list(args)}
  end

  def scene_list(args, _) do
    Connection.from_list(Catalog.scene_list(args), args)
  end

  def scene_create(args, %{context: %{current_user: user}}) do
    case Catalog.scene_create(user, args) do
      {:error, changeset} ->
        {
          :error,
          message: "Scene creation failed", details: Errors.error_details(changeset)
        }

      {:ok, scene} ->
        {:ok, %{scene: scene}}
    end
  end

  def scene_update(args, %{context: %{current_user: user}}) do
    case Catalog.scene_update(user, args) do
      {:error, changeset} ->
        {
          :error,
          message: "Scene update failed", details: Errors.error_details(changeset)
        }

      {:ok, scene} ->
        {:ok, %{scene: scene}}
    end
  end

  def scene_delete(args, %{context: %{current_user: user}}) do
    scene = Database.Repo.get_by(Database.Catalog.Scene, id: args.id)

    case Catalog.scene_delete(user, scene, args) do
      {:error, changeset} ->
        {
          :error,
          message: "Scene delete failed", details: Errors.error_details(changeset)
        }

      {:ok, scene} ->
        {:ok, %{scene: scene}}
    end
  end

  def pack_scene_update(args, %{context: %{current_user: user}}) do
    case Catalog.pack_scene_update(user, args) do
      {:error, changeset} ->
        {
          :error,
          message: "Pack scene update failed", details: Errors.error_details(changeset)
        }

      {:ok, pack_scene} ->
        {:ok, %{pack_scene: pack_scene}}
    end
  end

  def question_type_list(_, _, _) do
    {:ok, Catalog.question_type_list()}
  end

  def answer_type_list(_, _, _) do
    {:ok, Catalog.answer_type_list()}
  end

  def scene_get_by_id(args, _) do
    scene = Catalog.scene_get_by_id(args)
    {:ok, scene}
  end
end

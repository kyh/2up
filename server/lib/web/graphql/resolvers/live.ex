defmodule Web.GraphQL.Resolvers.Live do
  alias Absinthe.Relay.Connection
  alias Web.GraphQL.Errors
  alias Database.Live
  alias Game.GameSupervisor
  alias Game.GameServer

  def game_create(%{pack_id: pack_id}, _) do
    code = Live.generate_code()

    scenes =
      Database.Catalog.scene_list(pack_id)
      |> Enum.shuffle()
      |> Enum.take(10)
      |> Enum.map(fn scene ->
        scene_answers =
          Database.Catalog.scene_answer_list(%{scene_id: scene.scene_id})
          |> Enum.map(fn scene_answer ->
            %{
              id: scene_answer.id,
              isCorrect: scene_answer.is_correct,
              content: scene_answer.content
            }
          end)

        Map.put(scene, :scene_answers, scene_answers)
      end)

    case GameSupervisor.start_game(code, scenes) do
      {:ok, _game_pid} ->
        {:ok, %{code: code}}

      {:error, _error} ->
        {:error, message: "Server error"}
    end
  end

  def game_validate(_, %{code: code}, _) do
    case GameServer.game_pid(code) do
      pid when is_pid(pid) ->
        {:ok, %{is_valid: true}}

      nil ->
        {:ok, %{is_valid: false}}
    end
  end

  def pack_list(_, args, _) do
    Connection.from_list(Live.pack_list(args), args)
  end

  def pack_get_by_id(args, _) do
    pack = Live.pack_get_by_id(args.id)
    {:ok, pack}
  end

  def pack_create(_, args, %{context: %{current_user: user}}) do
    case Live.pack_create(user, args) do
      {:error, changeset} ->
        {
          :error,
          message: "Pack creation failed", details: Errors.error_details(changeset)
        }

      {:ok, pack} ->
        {:ok, %{pack: pack}}
    end
  end

  def pack_update(args, %{context: %{current_user: user}}) do
    case Live.pack_update(user, args) do
      {:error, changeset} ->
        {
          :error,
          message: "Pack update failed", details: Errors.error_details(changeset)
        }

      {:ok, pack} ->
        {:ok, %{pack: pack}}
    end
  end

  def pack_delete(args, %{context: %{current_user: user}}) do
    case Live.pack_delete(user, args) do
      {:error, changeset} ->
        {
          :error,
          message: "Pack delete failed", details: Errors.error_details(changeset)
        }

      {:ok, pack} ->
        {:ok, %{pack: pack}}
    end
  end

  def pack_asset_create(args, %{context: %{current_user: user}}) do
    pack = Live.pack_get_by_id(args.pack_id)

    case Live.pack_asset_create(user, pack, args) do
      {:error, changeset} ->
        {
          :error,
          message: "Pack asset create failed", details: Errors.error_details(changeset)
        }

      {:ok, pack_asset} ->
        {:ok, %{pack_asset: pack_asset}}
    end
  end

  def pack_asset_delete(args, %{context: %{current_user: user}}) do
    pack = Live.pack_get_by_id(args.pack_id)

    case Live.pack_asset_create(user, pack, args) do
      {:error, changeset} ->
        {
          :error,
          message: "Pack asset delete failed", details: Errors.error_details(changeset)
        }

      {:ok, pack_asset} ->
        {:ok, %{pack_asset: pack_asset}}
    end
  end

  def pack_asset_list(_, args, _) do
    Connection.from_list(Live.pack_asset_list(args), args)
  end

  def pack_tag_list(_, args, _) do
    {:ok, Live.pack_tag_list(args)}
  end
end

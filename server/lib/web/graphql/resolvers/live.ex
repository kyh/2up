defmodule Web.GraphQL.Resolvers.Live do
  alias Absinthe.Relay.Connection
  alias Web.GraphQL.Errors
  alias Database.Live
  alias Game.GameSupervisor
  alias Game.GameServer

  def game_create(%{pack_id: pack_id}, _) do
    code = Live.generate_code()

    questions =
      Database.Catalog.question_list(pack_id)
      |> Enum.shuffle()
      |> Enum.take(10)

    case GameSupervisor.start_game(code, questions) do
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
end

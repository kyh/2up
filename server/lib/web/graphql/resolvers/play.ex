defmodule Web.GraphQL.Resolvers.Play do
  alias Database.Catalog
  alias Game.GameSupervisor
  alias Game.GameServer

  def game_create(_, %{pack: pack}, _) do
    code = Catalog.generate_code()

    case GameSupervisor.start_game(code, pack) do
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
end

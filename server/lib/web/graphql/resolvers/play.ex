defmodule Web.GraphQL.Resolvers.Play do
  alias Database.Catalog
  alias Trivia.GameSupervisor
  alias Trivia.GameServer

  def trivia_new(_, _, _) do
    code = Catalog.generate_code()

    case GameSupervisor.start_game(code, "Startups") do
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

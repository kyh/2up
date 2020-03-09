defmodule Web.GraphQL.Resolvers.Play do
  alias Database.Catalog
  alias Trivia.GameSupervisor

  def trivia_new(_, _, _) do
    code = Catalog.generate_code()

    case GameSupervisor.start_game(code, "Startups") do
      {:ok, _game_pid} ->
        {:ok, %{code: code}}
      {:error, _error} ->
        {:error, message: "Server error"}
    end
  end
end

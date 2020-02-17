defmodule Web.PlayhouseChannel do
  use Web, :channel

  alias Database.{Catalog}
  alias Trivia.{GameSupervisor}

  def join("playhouse", _payload, socket) do
    {:ok, socket}
  end

  def handle_in("trivia:new", _payload, socket) do
    code = Catalog.generate_code()
    questions = Catalog.random_formatted_questions(10)

    case GameSupervisor.start_game(code, questions) do
      {:ok, _game_pid} ->
        push socket, "new_game", %{ gameID: code }
        {:noreply, socket}

      {:error, _error} ->
        {:error, %{reason: "Server error"}}
    end
  end
end

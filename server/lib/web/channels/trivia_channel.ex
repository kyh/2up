defmodule Web.TriviaChannel do
  use Web, :channel

  alias Database.{Play, Catalog}
  alias Trivia.{GameSupervisor, GameServer}

  def join("trivia", _payload, socket) do
    {:ok, socket}
  end

  def handle_in("trivia:new", _payload, socket) do
    code = Catalog.generate_code()
    questions = [
      ["What is 2 + 2", "4"],
      ["What is 2 + 3", "5"]
    ]

    case GameSupervisor.start_game(code, questions) do
      {:ok, _game_pid} ->
        push socket, "game", %{ gameID: code }
        {:noreply, socket}

      {:error, _error} ->
        {:error, %{reason: "Server error"}}
    end
  end
end

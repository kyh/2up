defmodule Web.PlayhouseChannel do
  use Web, :channel

  alias Database.{Catalog}
  alias Trivia.{GameSupervisor}

  def join("playhouse", _payload, socket) do
    {:ok, socket}
  end

  def handle_in("trivia:new", payload, socket) do
    code = Catalog.generate_code()

    case GameSupervisor.start_game(code, payload["pack"]) do
      {:ok, _game_pid} ->
        push socket, "trivia/new_game", %{ gameID: code }
        {:noreply, socket}

      {:error, _error} ->
        {:error, %{reason: "Server error"}}
    end
  end
end

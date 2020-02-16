defmodule Web.GameChannel do
  use Web, :channel

  alias Web.{Presence}
  alias Database.{Play, Catalog}
  alias Trivia.{GameSupervisor, GameServer}

  def join("game:" <> game_code, _payload, socket) do
    case GameServer.game_pid(game_code) do
      pid when is_pid(pid) ->
        send(self(), {:after_join, game_code})
        {:ok, socket}

      nil ->
        {:error, %{reason: "Game does not exist"}}
    end
  end

  def handle_info({:after_join, game_code}, socket) do
    state = GameServer.state(game_code)

    push(socket, "game_state", state)
    {:noreply, socket}
  end
end

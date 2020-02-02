defmodule PlayhouseWeb.TriviaChannel do
  use PlayhouseWeb, :channel
  alias PlayhouseWeb.Presence
  require Logger

  def join("game:trivia", payload, socket) do
    send(self(), :after_join)
    {:ok, socket}
  end

  def handle_in("ping", payload, socket) do
    {:reply, {:ok, payload}, socket}
  end

  def handle_in("game:join", _p, socket) do
    payload = %{
      act: 1,
      scene: 1,
      question: "Who won the NBA Finals in 2003?",
      players: [
        %{ name: "Andrew", score: 0},
        %{ name: "Kai", score: 0},
      ]
    }

    broadcast socket, "game", payload
    {:noreply, socket}
  end

  def handle_in("player:submit", payload, socket) do
    broadcast socket, "player:submit", payload

    # TODO: if submissions == amount of players
    # broadcast socket, "game", payload

    {:noreply, socket}
  end

  # TODO: player:join
end

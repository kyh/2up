defmodule PlayhouseWeb.RoomChannel do
  use PlayhouseWeb, :channel
  alias PlayhouseWeb.Presence
  require Logger

  def join("room:lobby", payload, socket) do
    send(self(), :after_join)
    {:ok, socket}
  end

  def handle_in("ping", payload, socket) do
    {:reply, {:ok, payload}, socket}
  end

  def handle_in("broadcast", %{"message" => "scene1"}, socket) do
    payload = %{
      question: "Who won the NBA Finals in 2003?",
      players: [
        %{ name: "Andrew", score: 0},
        %{ name: "Kai", score: 0},
      ]
    }

    broadcast socket, "scene1", payload
    {:noreply, socket}
  end

  def handle_in("broadcast", %{"message" => "player:submit", "submission" => submission}, socket) do
    broadcast socket, "player:submit", %{submission: submission}
    {:noreply, socket}
  end
end

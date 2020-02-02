defmodule PlayhouseWeb.RoomChannel do
  use PlayhouseWeb, :channel
  alias PlayhouseWeb.Presence
  require Logger

  def join("room:lobby", payload, socket) do
    if authorized?(payload) do
      send(self(), :after_join)
      {:ok, socket}
    else
      {:error, %{reason: "unauthorized"}}
    end
  end

  def handle_in("ping", payload, socket) do
    {:reply, {:ok, payload}, socket}
  end

  def handle_in("shout", payload, socket) do
    Playhouse.Message.changeset(%Playhouse.Message{}, payload) |> Playhouse.Repo.insert  
    broadcast socket, "shout", payload
    {:noreply, socket}
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

  def handle_in("broadcast", %{"message" => "player:submit"}, socket) do
    broadcast socket, "player:submit", %{submission: %{content: "DUMMY", name: "NAME"}}
    {:noreply, socket}
  end

  def handle_in("broadcast", %{"message" => "join", "name" => name}, socket) do
    Presence.track(socket, name, %{
      online_at: inspect(System.system_time(:second))
    })
    broadcast socket, "join", %{"players" => Presence.list(socket)}
    {:noreply, socket}
  end

  def handle_in("broadcast", %{"message" => "scene:next"}, socket) do
    broadcast socket, "scene:next", %{"message" => "scene:next"}
    {:noreply, socket}
  end

  def handle_in("broadcast", %{"message" => "act:next"}, socket) do
    broadcast socket, "act:next", %{"message" => "act:next"}
    {:noreply, socket}
  end

  def handle_in("broadcast", payload, socket) do
    broadcast socket, "start", payload
    {:noreply, socket}
  end

  defp authorized?(_payload) do
    true
  end

  def handle_info(:after_join, socket) do
    Playhouse.Message.get_messages()
    |> Enum.each(fn msg -> push(socket, "shout", %{
        name: msg.name,
        message: msg.message,
      }) end)
    {:noreply, socket}
  end
end

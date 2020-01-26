defmodule RemoteWeb.RoomChannel do
  use RemoteWeb, :channel

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
    Remote.Message.changeset(%Remote.Message{}, payload) |> Remote.Repo.insert  
    broadcast socket, "shout", payload
    {:noreply, socket}
  end

  defp authorized?(_payload) do
    true
  end

  def handle_info(:after_join, socket) do
    Remote.Message.get_messages()
    |> Enum.each(fn msg -> push(socket, "shout", %{
        name: msg.name,
        message: msg.message,
      }) end)
    {:noreply, socket} # :noreply
  end

end

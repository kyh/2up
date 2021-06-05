defmodule Web.UserSocket do
  use Phoenix.Socket

  channel "game:*", Web.GameChannel

  @doc """
  Socket params are passed from the client and can be used
  to verify and authenticate a user
  """
  def connect(_params, socket, _connect_info) do
    {:ok, socket}
  end

  @doc """
  Socket id's are topics that allow you to identify all
  sockets for a given user
  """
  def id(_socket), do: nil
end

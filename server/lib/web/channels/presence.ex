defmodule Web.Presence do
  @moduledoc """
  Provides presence tracking to channels and processes
  """

  use Phoenix.Presence,
    otp_app: :playhouse,
    pubsub_server: Playhouse.PubSub
end

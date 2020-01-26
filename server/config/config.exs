# This file is responsible for configuring your application
# and its dependencies with the aid of the Mix.Config module.
#
# This configuration file is loaded before any dependency and
# is restricted to this project.

# General application configuration
use Mix.Config

config :remote,
  ecto_repos: [Remote.Repo]

# Configures the endpoint
config :remote, RemoteWeb.Endpoint,
  url: [host: "localhost"],
  secret_key_base: "XvP1K4u3s6kkRTKp2k3ypqzuzbn5zjEIZNLQALc7m1ayOyXzVL0ZVt7pp28Dm9ye",
  render_errors: [view: RemoteWeb.ErrorView, accepts: ~w(html json)],
  pubsub: [name: Remote.PubSub, adapter: Phoenix.PubSub.PG2]

# Configures Elixir's Logger
config :logger, :console,
  format: "$time $metadata[$level] $message\n",
  metadata: [:request_id]

# Use Jason for JSON parsing in Phoenix
config :phoenix, :json_library, Jason

# Import environment specific config. This must remain at the bottom
# of this file so it overrides the configuration defined above.
import_config "#{Mix.env()}.exs"

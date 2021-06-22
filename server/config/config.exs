# This file is responsible for configuring your application
# and its dependencies with the aid of the Mix.Config module.
#
# This configuration file is loaded before any dependency and
# is restricted to this project.

# General application configuration
use Mix.Config

config :playhouse,
  ecto_repos: [Database.Repo]

config :cors_plug,
  origin: [System.get_env("WEB_CLIENT_URL")],
  max_age: 86400,
  methods: ["GET", "POST"]

# Configures the endpoint
config :playhouse, Web.Endpoint,
  url: [host: "localhost"],
  secret_key_base: "XvP1K4u3s6kkRTKp2k3ypqzuzbn5zjEIZNLQALc7m1ayOyXzVL0ZVt7pp28Dm9ye",
  render_errors: [view: Web.ErrorView, accepts: ~w(html json)],
  pubsub_server: Playhouse.PubSub

# Configures Elixir's Logger
config :logger, :console,
  format: "$time $metadata[$level] $message\n",
  metadata: [:request_id]

# Use Jason for JSON parsing in Phoenix
config :phoenix, :json_library, Jason

# Configures AWS IAM user
config :ex_aws,
  json_codec: Jason,
  access_key_id: [{:system, "AWS_ACCESS_KEY_ID"}, :instance_role],
  secret_access_key: [{:system, "AWS_SECRET_ACCESS_KEY"}, :instance_role]

# Import environment specific config. This must remain at the bottom
# of this file so it overrides the configuration defined above.
import_config "#{Mix.env()}.exs"

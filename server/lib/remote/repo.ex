defmodule Remote.Repo do
  use Ecto.Repo,
    otp_app: :remote,
    adapter: Ecto.Adapters.Postgres
end

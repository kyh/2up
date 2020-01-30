defmodule Playhouse.Repo do
  use Ecto.Repo,
    otp_app: :playhouse,
    adapter: Ecto.Adapters.Postgres
end

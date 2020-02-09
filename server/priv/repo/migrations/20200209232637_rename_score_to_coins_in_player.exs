defmodule Playhouse.Repo.Migrations.RenameScoreToCoinsInPlayer do
  use Ecto.Migration

  def change do
    rename table("players"), :score, to: :coins
  end
end

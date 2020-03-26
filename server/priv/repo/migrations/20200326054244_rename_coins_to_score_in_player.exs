defmodule Database.Repo.Migrations.RenameCoinsToScoreInPlayer do
  use Ecto.Migration

  def change do
    rename table("players"), :coins, to: :score
  end
end

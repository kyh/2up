defmodule Database.Repo.Migrations.RemoveEndorsements do
  use Ecto.Migration

  def change do
    drop table(:endorsements)
  end
end

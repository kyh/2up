defmodule Database.Repo.Migrations.RemoveTags do
  use Ecto.Migration

  def change do
    drop table(:tags)
  end
end

defmodule Database.Repo.Migrations.RemovePackScenes do
  use Ecto.Migration

  def change do
    drop table(:pack_scenes)
  end
end

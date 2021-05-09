defmodule Database.Repo.Migrations.RemoveActTags do
  use Ecto.Migration

  def change do
    drop table(:act_tags)
  end
end

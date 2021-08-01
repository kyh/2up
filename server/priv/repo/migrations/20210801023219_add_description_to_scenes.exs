defmodule Database.Repo.Migrations.AddDescriptionToScenes do
  use Ecto.Migration

  def change do
    alter table(:scenes) do
      add :description, :text
    end
  end
end

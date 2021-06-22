defmodule Database.Repo.Migrations.AddExternalIdToScenes do
  use Ecto.Migration

  def change do
    alter table(:scenes) do
      add :external_id, :string
    end
  end
end

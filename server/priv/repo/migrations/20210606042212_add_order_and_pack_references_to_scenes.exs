defmodule Database.Repo.Migrations.AddOrderAndPackReferencesToScenes do
  use Ecto.Migration

  def change do
    alter table(:scenes) do
      add :pack_id, references(:packs), null: false
      add :order, :decimal
    end
  end
end

defmodule Database.Repo.Migrations.CreatePackAssets do
  use Ecto.Migration

  def change do
    create table(:pack_assets) do
      add :pack_id, references(:packs), null: false
      add :raw_name, :string, null: false
      add :path, :string, null: false

      timestamps()
    end
  end
end

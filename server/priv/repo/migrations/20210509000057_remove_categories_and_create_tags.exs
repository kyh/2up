defmodule Database.Repo.Migrations.RemoveCategoriesAndCreateTags do
  use Ecto.Migration

  def change do
    drop table(:pack_categories)
    drop table(:categories)

    create table(:tags) do
      add :name, :string, null: false

      timestamps()
    end

    create table(:pack_tags) do
      add :pack_id, references(:packs), null: false
      add :tag_id, references(:tags), null: false

      timestamps()
    end
  end
end

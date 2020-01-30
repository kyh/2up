defmodule Playhouse.Repo.Migrations.CreateProductions do
  use Ecto.Migration

  def change do
    create table(:productions) do
      add :character_id, references(:characters), null: true
      add :play_id, references(:plays), null: false

      timestamps()
    end
  end
end

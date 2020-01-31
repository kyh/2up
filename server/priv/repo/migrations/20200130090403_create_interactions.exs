defmodule Playhouse.Repo.Migrations.CreateInteractions do
  use Ecto.Migration

  def change do
    create table(:interactions) do
      add :response_id, references(:responses), null: false
      add :character_id, references(:characters), null: false
      add :performance_id, references(:performances), null: false

      timestamps()
    end
  end
end

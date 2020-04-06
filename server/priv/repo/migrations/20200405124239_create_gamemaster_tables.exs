defmodule Database.Repo.Migrations.CreateGamemasterTables do
  use Ecto.Migration

  def change do
    create table(:plays, primary_key: false) do
      add :id, :uuid, primary_key: true

      add :name, :string, null: false

      timestamps()
    end

    create table(:packs, primary_key: false) do
      add :id, :uuid, primary_key: true

      add :name, :string, null: false
      add :instruction, :string, null: false

      timestamps()
    end

    create table(:acts, primary_key: false) do
      add :id, :uuid, primary_key: true

      add :endorsement_type, :integer, null: false

      timestamps()
    end

    create table(:play_acts, primary_key: false) do
      add :id, :uuid, primary_key: true

      timestamps()
    end

    create table(:act_questions, primary_key: false) do
      add :id, :uuid, primary_key: true

      timestamps()
    end

    create table(:answers, primary_key: false) do
      add :id, :uuid, primary_key: true

      add :content, :string, null: false
      add :answer_type, :integer, null: false

      timestamps()
    end
  end
end

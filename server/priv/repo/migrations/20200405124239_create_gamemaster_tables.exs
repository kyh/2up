defmodule Database.Repo.Migrations.CreateGamemasterTables do
  use Ecto.Migration

  def change do
    create table(:plays) do
      add :name, :string, null: false

      timestamps()
    end

    create table(:packs) do
      add :name, :string, null: false
      add :instruction, :string, null: false

      timestamps()
    end

    create table(:acts) do
      add :endorsement_type, :integer, null: false

      timestamps()
    end

    create table(:play_acts) do
      timestamps()
    end

    create table(:act_questions) do
      timestamps()
    end

    create table(:answers) do
      add :content, :string, null: false
      add :answer_type, :integer, null: false

      timestamps()
    end
  end
end

defmodule Database.Repo.Migrations.CreateGamemasterTables do
  use Ecto.Migration

  def change do
    create table(:plays) do
      add :game_state, :map

      timestamps()
    end

    create table(:packs) do
      add :name, :string, null: false
      add :is_random, :boolean, null: false
      add :length, :integer, null: false

      timestamps()
    end

    create table(:categories) do
      add :name, :string, null: false

      timestamps()
    end

    create table(:pack_categories) do
      timestamps()
    end

    create table(:acts) do
      add :question, :string, null: false
      add :answer, :string

      timestamps()
    end

    create table(:pack_acts) do
      add :order, :integer, null: false

      timestamps()
    end

    create table(:question_types) do
      add :slug, :string, null: false

      timestamps()
    end

    create table(:answer_types) do
      add :slug, :string, null: false

      timestamps()
    end

    create table(:act_tags) do
      timestamps()
    end

    create table(:tags) do
      add :name, :string, null: false

      timestamps()
    end
  end
end

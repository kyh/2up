defmodule Playhouse.Repo.Migrations.CreatePlayers do
  use Ecto.Migration

  def change do
    create table(:players) do
      add :game_id, references(:games), null: false

      add :name, :string, null: false
      add :score, :integer, null: false

      timestamps()
    end
  end
end

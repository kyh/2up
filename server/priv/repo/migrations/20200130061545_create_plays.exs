defmodule Remote.Repo.Migrations.CreatePlays do
  use Ecto.Migration

  def change do
    create table(:plays) do
      add :name, :string, null: false
      add :user_id, references(:users), null: false

      timestamps()
    end
  end
end

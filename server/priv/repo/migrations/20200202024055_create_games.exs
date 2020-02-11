defmodule Database.Repo.Migrations.CreateGames do
  use Ecto.Migration

  def change do
    create table(:games) do
      add :act, :integer, null: false
      add :scene, :integer, null: false

      timestamps()
    end
  end
end

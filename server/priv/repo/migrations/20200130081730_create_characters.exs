defmodule Playhouse.Repo.Migrations.CreateCharacters do
  use Ecto.Migration

  def change do
    create table(:characters) do
      add :name, :string, null: false
      add :user_id, references(:users), null: true

      timestamps()
    end
  end
end

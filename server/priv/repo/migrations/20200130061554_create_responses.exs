defmodule Playhouse.Repo.Migrations.CreateResponses do
  use Ecto.Migration

  def change do
    create table(:responses) do
      add :response, :string, null: false
      add :correct, :boolean, default: false, null: false
      add :user_id, references(:users), null: false
      add :scene_id, references(:scenes), null: false

      timestamps()
    end
  end
end

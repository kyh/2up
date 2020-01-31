defmodule Playhouse.Repo.Migrations.CreateScenes do
  use Ecto.Migration

  def change do
    create table(:scenes) do
      add :prompt, :string, null: false
      add :user_id, references(:users), null: false
      add :play_id, references(:plays), null: false

      timestamps()
    end
  end
end

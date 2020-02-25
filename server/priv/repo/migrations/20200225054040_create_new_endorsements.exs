defmodule Database.Repo.Migrations.CreateNewEndorsements do
  use Ecto.Migration

  def change do
    create table(:endorsements) do
      add :submission_id, references(:submissions), null: false
      add :player_id, references(:players), null: false

      timestamps()
    end
  end
end

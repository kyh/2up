defmodule Playhouse.Repo.Migrations.CreateEndorsements do
  use Ecto.Migration

  def change do
    create table(:endorsements) do
      add :submission_id, references(:submissions), null: true
      add :answer_id, references(:answers), null: true

      timestamps()
    end
  end
end

defmodule Database.Repo.Migrations.CreateSubmissions do
  use Ecto.Migration

  def change do
    create table(:submissions) do
      add :game_question_id, references(:game_questions), null: false
      add :player_id, references(:players), null: false

      add :content, :string, null: false

      timestamps()
    end
  end
end

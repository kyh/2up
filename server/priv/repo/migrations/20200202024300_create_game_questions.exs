defmodule Database.Repo.Migrations.CreateGameQuestions do
  use Ecto.Migration

  def change do
    create table(:game_questions) do
      add :game_id, references(:games), null: false
      add :question_id, references(:questions), null: false

      timestamps()
    end
  end
end

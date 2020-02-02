defmodule Playhouse.Repo.Migrations.CreateAnswers do
  use Ecto.Migration

  def change do
    create table(:answers) do
      add :question_id, references(:questions), null: false

      add :content, :string, null: false

      timestamps()
    end
  end
end

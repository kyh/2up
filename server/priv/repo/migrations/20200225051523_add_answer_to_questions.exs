defmodule Database.Repo.Migrations.AddAnswerToQuestions do
  use Ecto.Migration

  def change do
    alter table(:questions) do
      add :answer, :string, null: false
    end
  end
end

defmodule Database.Repo.Migrations.AddInstructionAndQuestionTypeAndRemoveAnswerFromQuestions do
  use Ecto.Migration

  def change do
    alter table(:questions) do
      remove :answer

      add :instruction, :string, null: false
      add :question_type, :integer, null: false
    end
  end
end

defmodule Database.Repo.Migrations.ModifyQuestionToTextInScenes do
  use Ecto.Migration

  def change do
    alter table(:scenes) do
      modify :question, :text
    end
  end
end

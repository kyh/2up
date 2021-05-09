defmodule Database.Repo.Migrations.CreateSceneAnswers do
  use Ecto.Migration

  def change do
    create table(:scene_answers) do
      add :scene_id, references(:scenes), null: false

      add :content, :string, null: false
      add :is_correct, :boolean, null: false, default: false

      timestamps()
    end
  end
end

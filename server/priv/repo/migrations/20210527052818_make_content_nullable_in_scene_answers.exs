defmodule Database.Repo.Migrations.MakeContentNullableInSceneAnswers do
  use Ecto.Migration

  def change do
    alter table(:scene_answers) do
      modify :content, :string, null: true, default: ""
    end
  end
end

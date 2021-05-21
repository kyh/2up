defmodule Database.Repo.Migrations.AddDefaultToContentInSceneAnswers do
  use Ecto.Migration

  def change do
    alter table(:scene_answers) do
      modify :content, :string, null: false, default: ""
    end
  end
end

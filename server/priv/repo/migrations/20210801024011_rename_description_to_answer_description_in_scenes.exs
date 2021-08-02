defmodule Database.Repo.Migrations.RenameDescriptionToAnswerDescriptionInScenes do
  use Ecto.Migration

  def change do
    rename table("scenes"), :description, to: :answer_description
  end
end

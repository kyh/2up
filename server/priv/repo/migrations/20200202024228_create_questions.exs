defmodule Database.Repo.Migrations.CreateQuestions do
  use Ecto.Migration

  def change do
    create table(:questions) do
      add :content, :string, null: false

      timestamps()
    end
  end
end

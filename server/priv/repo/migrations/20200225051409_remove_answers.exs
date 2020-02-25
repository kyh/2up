defmodule Database.Repo.Migrations.RemoveAnswers do
  use Ecto.Migration

  def change do
    drop table(:answers)
  end
end

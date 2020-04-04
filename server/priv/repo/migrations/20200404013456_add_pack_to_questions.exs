defmodule Database.Repo.Migrations.AddPackToQuestionss do
  use Ecto.Migration

  def change do
    alter table(:questions) do
      add :pack, :string
    end
  end
end

defmodule Database.Repo.Migrations.ChangePrimaryKeyToUuidForUsersAndQuestions do
  use Ecto.Migration

  def change do
    alter table(:users) do
      remove :id
      add :id, :uuid, primary_key: true
    end

    alter table(:questions) do
      remove :id
      add :id, :uuid, primary_key: true
    end
  end
end

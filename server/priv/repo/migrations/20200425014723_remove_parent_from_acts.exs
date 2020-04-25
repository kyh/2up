defmodule Database.Repo.Migrations.RemoveParentFromActs do
  use Ecto.Migration

  def change do
    alter table(:acts) do
      remove :parent_id
    end
  end
end

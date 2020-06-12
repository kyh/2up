defmodule Database.Repo.Migrations.RemoveOrderFromPackActs do
  use Ecto.Migration

  def change do
    alter table(:pack_acts) do
      remove :order
    end
  end
end

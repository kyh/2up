defmodule Database.Repo.Migrations.AddNewOrderToPackActs do
  use Ecto.Migration

  def change do
    alter table(:pack_acts) do
      add :new_order, :decimal
    end
  end
end

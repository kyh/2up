defmodule Database.Repo.Migrations.RenameNewOrderToOrderInPackActs do
  use Ecto.Migration

  def change do
    rename table("pack_acts"), :new_order, to: :order
  end
end

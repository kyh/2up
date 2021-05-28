defmodule Database.Repo.Migrations.ChangeOrderToDecimalInPackScenes do
  use Ecto.Migration

  def change do
    alter table(:pack_scenes) do
      modify :order, :decimal
    end
  end
end

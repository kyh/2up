defmodule Playhouse.Repo.Migrations.AddCodeToGames do
  use Ecto.Migration

  def change do
    alter table(:games) do
      add :code, :string, null: false
    end
  end
end

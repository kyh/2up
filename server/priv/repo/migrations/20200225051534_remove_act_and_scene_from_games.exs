defmodule Database.Repo.Migrations.RemoveActAndSceneFromGames do
  use Ecto.Migration

  def change do
    alter table(:games) do
      remove :act
      remove :scene
    end
  end
end

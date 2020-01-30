defmodule Remote.Repo.Migrations.AddProductionToCharacters do
  use Ecto.Migration

  def change do
    alter table(:characters) do
      add :production_id, references(:productions), null: false
    end
  end
end

defmodule Database.Repo.Migrations.AddInstructionsToActs do
  use Ecto.Migration

  def change do
    alter table(:acts) do
      add :instruction, :string
    end
  end
end

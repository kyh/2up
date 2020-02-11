defmodule Database.Repo.Migrations.AddPlayerToEndorsements do
  use Ecto.Migration

  def change do
    alter table(:endorsements) do
      add :player_id, references(:players), null: false
    end
  end
end

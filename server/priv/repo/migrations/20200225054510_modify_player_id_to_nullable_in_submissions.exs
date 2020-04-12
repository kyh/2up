defmodule Database.Repo.Migrations.ModifyPlayerIdToNullableInSubmissions do
  use Ecto.Migration

  def up do
    execute "ALTER TABLE submissions DROP CONSTRAINT submissions_player_id_fkey"

    alter table(:submissions) do
      modify :player_id, references(:players), null: true
    end
  end

  def down do
    execute "ALTER TABLE submissions DROP CONSTRAINT submissions_player_id_fkey"

    alter table(:submissions) do
      modify :player_id, references(:players), null: false
    end
  end
end

defmodule Database.Repo.Migrations.RemovePlayTables do
  use Ecto.Migration

  def change do
    drop table(:endorsements)
    drop table(:submissions)
    drop table(:game_questions)
    drop table(:players)
    drop table(:games)
  end
end

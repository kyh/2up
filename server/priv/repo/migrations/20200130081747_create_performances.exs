defmodule Remote.Repo.Migrations.CreatePerformances do
  use Ecto.Migration

  def change do
    create table(:performances) do
      add :scene_id, references(:scenes), null: false

      timestamps()
    end
  end
end

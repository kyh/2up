defmodule Database.Repo.Migrations.RemoveActsAndAddScenes do
  use Ecto.Migration

  def change do
    drop table(:pack_acts)
    drop table(:acts)

    create table(:scenes) do
      add :question_type_id, references(:question_types), null: false
      add :answer_type_id, references(:answer_types), null: false
      add :question, :string, null: false
      add :instruction, :string

      timestamps()
    end

    create table(:pack_scenes) do
      add :pack_id, references(:packs), null: false
      add :scene_id, references(:scenes), null: false
      add :order, :integer

      timestamps()
    end
  end
end

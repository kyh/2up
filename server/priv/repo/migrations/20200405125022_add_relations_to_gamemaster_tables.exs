defmodule Database.Repo.Migrations.AddRelationsToGamemasterTables do
  use Ecto.Migration

  def change do
    alter table(:plays) do
      add :user_id, references(:users), null: false
    end

    alter table(:packs) do
      add :user_id, references(:users), null: false
    end

    alter table(:acts) do
      add :user_id, references(:users), null: false
    end

    alter table(:play_acts) do
      add :play_id, references(:plays), null: false
      add :act_id, references(:acts), null: false
    end

    alter table(:act_questions) do
      add :act_id, references(:acts), null: false
      add :question_id, references(:questions), null: false
    end

    alter table(:questions) do
      add :pack_id, references(:packs), null: false
      add :user_id, references(:users), null: false
    end

    alter table(:answers) do
      add :question_id, references(:questions), null: false
    end
  end
end

defmodule Database.Repo.Migrations.AddRelationsToGamemasterTables do
  use Ecto.Migration

  def change do
    alter table(:plays) do
      add :pack_id, references(:packs), null: false
    end

    alter table(:packs) do
      add :user_id, references(:users), null: false
    end

    alter table(:pack_categories) do
      add :pack_id, references(:packs), null: false
      add :category_id, references(:categories), null: false
    end

    alter table(:acts) do
      add :parent_id, references(:acts)
      add :user_id, references(:users), null: false
      add :question_type_id, references(:question_types), null: false
      add :answer_type_id, references(:answer_types), null: false
    end

    alter table(:pack_acts) do
      add :pack_id, references(:packs), null: false
      add :act_id, references(:acts), null: false
    end

    alter table(:act_tags) do
      add :act_id, references(:acts), null: false
      add :tag_id, references(:tags), null: false
    end
  end
end

defmodule Database.Repo.Migrations.AddCascadeDeleteToPackAssetsScenesAndSceneAnswers do
  use Ecto.Migration

  def up do
    execute "ALTER TABLE scenes DROP CONSTRAINT scenes_pack_id_fkey"

    alter table(:scenes) do
      modify :pack_id, references(:packs, on_delete: :delete_all)
    end

    execute "ALTER TABLE scene_answers DROP CONSTRAINT scene_answers_scene_id_fkey"

    alter table(:scene_answers) do
      modify :scene_id, references(:scenes, on_delete: :delete_all)
    end

    execute "ALTER TABLE pack_assets DROP CONSTRAINT pack_assets_pack_id_fkey"

    alter table(:pack_assets) do
      modify :pack_id, references(:packs, on_delete: :delete_all)
    end
  end

  def down do
    execute "ALTER TABLE scenes DROP CONSTRAINT scenes_pack_id_fkey"

    alter table(:scenes) do
      modify :pack_id, references(:packs, on_delete: :nothing)
    end

    execute "ALTER TABLE scene_answers DROP CONSTRAINT scene_answers_scene_id_fkey"

    alter table(:scene_answers) do
      modify :scene_id, references(:scenes, on_delete: :nothing)
    end

    execute "ALTER TABLE pack_assets DROP CONSTRAINT pack_assets_pack_id_fkey"

    alter table(:pack_assets) do
      modify :pack_id, references(:packs, on_delete: :nothing)
    end
  end
end

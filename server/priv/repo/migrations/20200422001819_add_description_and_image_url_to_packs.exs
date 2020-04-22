defmodule Database.Repo.Migrations.AddDescriptionAndImageUrlToPacks do
  use Ecto.Migration

  def change do
    alter table(:packs) do
      add :image_url, :string
      add :description, :string
    end
  end
end

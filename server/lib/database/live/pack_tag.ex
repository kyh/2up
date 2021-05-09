defmodule Database.Live.PackTag do
  use Database.Model

  schema "pack_categories" do
    belongs_to :pack, Pack
    belongs_to :category, Tag

    timestamps()
  end

  def changeset(pack_category, attrs) do
    pack_category
    |> cast(attrs, [])
    |> assoc_constraint(:pack)
    |> assoc_constraint(:category)
  end
end

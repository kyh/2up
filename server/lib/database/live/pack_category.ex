defmodule Database.Live.PackCategory do
  use Database.Model

  schema "pack_categories" do
    belongs_to :pack, Pack
    belongs_to :category, Category

    timestamps()
  end

  def changeset(pack_category, attrs) do
    pack_category
    |> cast(attrs, [])
    |> assoc_constraint(:pack)	
    |> assoc_constraint(:category)	
  end
end

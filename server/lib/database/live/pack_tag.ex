defmodule Database.Live.PackTag do
  use Database.Model

  schema "pack_tags" do
    belongs_to :pack, Pack
    belongs_to :tag, Tag

    timestamps()
  end

  def changeset(pack_tag, attrs) do
    pack_tag
    |> cast(attrs, [])
    |> assoc_constraint(:pack)
    |> assoc_constraint(:tag)
  end
end

defmodule Database.Catalog.ActTag do
  use Database.Model

  schema "act_tags" do
    belongs_to :act, Act
    belongs_to :tag, Tag

    timestamps()
  end

  def changeset(act_tag, attrs) do
    act_tag
    |> cast(attrs, [])
    |> assoc_constraint(:act)	
    |> assoc_constraint(:tag)	
  end
end

defmodule Database.Catalog.PlayAct do
  use Database.Schema
  import Ecto.Changeset

  schema "play_acts" do
    belongs_to :play, Database.Catalog.Play
    belongs_to :act, Database.Catalog.Act

    timestamps()
  end

  def changeset(question, attrs) do
    question
    |> cast(attrs, [])
    |> assoc_constraint(:play)
    |> assoc_constraint(:act)	
  end
end

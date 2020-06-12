defmodule Database.Live.PackAct do
  use Database.Model

  schema "pack_acts" do
    belongs_to :pack, Pack
    belongs_to :act, Act

    field :order, :decimal

    timestamps()
  end

  def changeset(pack_act, attrs) do
    required_fields = [:order]

    pack_act
    |> cast(attrs, required_fields)
    |> assoc_constraint(:pack)
    |> assoc_constraint(:act)
  end
end

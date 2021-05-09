defmodule Database.Live.PackScene do
  use Database.Model

  schema "pack_scenes" do
    belongs_to :pack, Pack
    belongs_to :scene, Scene

    field :order, :integer

    timestamps()
  end

  def changeset(pack_scene, attrs) do
    required_fields = [:order]

    pack_scene
    |> cast(attrs, required_fields)
    |> assoc_constraint(:pack)
    |> assoc_constraint(:scene)
  end
end

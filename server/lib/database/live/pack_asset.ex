defmodule Database.Live.PackAsset do
  use Database.Model

  schema "pack_assets" do
    belongs_to :pack, Pack

    field :raw_name, :string
    field :path, :string

    timestamps()
  end

  def changeset(pack_asset, attrs) do
    required_fields = [:raw_name, :path]

    pack_asset
    |> cast(attrs, required_fields)
    |> assoc_constraint(:pack)
  end
end

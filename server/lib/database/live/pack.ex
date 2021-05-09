defmodule Database.Live.Pack do
  use Database.Model

  schema "packs" do
    belongs_to :user, User
    many_to_many :categories, Tag, join_through: PackTag
    many_to_many :scenes, Scene, join_through: PackScene

    field :name, :string
    field :is_random, :boolean
    field :length, :integer
    field :description, :string
    field :image_url, :string

    timestamps()
  end

  def changeset(pack, attrs) do
    required_fields = [:name, :is_random, :length, :description]

    pack
    |> cast(attrs, required_fields)
    |> validate_required(required_fields)
    |> assoc_constraint(:user)
  end
end

defmodule Database.Live.Pack do
  use Database.Model

  schema "packs" do
    has_many :scenes, Scene

    many_to_many :tags, Tag, join_through: PackTag

    belongs_to :user, User

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

defmodule Database.Live.Pack do
  use Database.Model

  schema "packs" do
    belongs_to :user, User
    many_to_many :categories, Category, join_through: PackCategory
    many_to_many :acts, Act, join_through: PackAct

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

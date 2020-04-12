defmodule Database.Live.Pack do
  use Database.Model

  schema "packs" do
    belongs_to :user, User
    many_to_many :categories, Category,
      join_through: PackCategory

    field :name, :string
    field :is_random, :boolean
    field :length, :integer

    timestamps()
  end

  def changeset(pack, attrs) do
    required_fields = [:name, :is_random, :length]

    pack
    |> cast(attrs, required_fields)
    |> validate_required(required_fields)
    |> assoc_constraint(:user)
  end
end

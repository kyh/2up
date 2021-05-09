defmodule Database.Live.Tag do
  use Database.Model

  schema "categories" do
    field :name, :string

    timestamps()
  end

  def changeset(category, attrs) do
    required_fields = [:name]

    category
    |> cast(attrs, required_fields)
    |> validate_required(required_fields)
  end
end

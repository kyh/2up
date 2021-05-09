defmodule Database.Live.Tag do
  use Database.Model

  schema "tags" do
    field :name, :string

    timestamps()
  end

  def changeset(tag, attrs) do
    required_fields = [:name]

    tag
    |> cast(attrs, required_fields)
    |> validate_required(required_fields)
  end
end

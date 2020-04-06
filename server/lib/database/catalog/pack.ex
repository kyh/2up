defmodule Database.Catalog.Pack do
  use Database.Model

  schema "packs" do
    belongs_to :user, Database.Catalog.User

    field :name, :string
    field :instruction, :string

    timestamps()
  end

  def changeset(question, attrs) do
    required_fields = [:name, :instruction]

    question
    |> cast(attrs, required_fields)
    |> validate_required(required_fields)
    |> assoc_constraint(:question)
  end
end

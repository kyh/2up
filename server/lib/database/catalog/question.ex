defmodule Database.Catalog.Question do
  use Ecto.Schema
  import Ecto.Changeset

  schema "questions" do
    field :content, :string
    field :answer, :string

    timestamps()
  end

  def changeset(question, attrs) do
    required_fields = [:content]

    question
    |> cast(attrs, required_fields)
    |> validate_required(required_fields)
  end
end

defmodule Database.Catalog.AnswerType do
  use Database.Model

  schema "answer_types" do
    has_many :acts, Act

    field :slug, :string

    timestamps()
  end

  def changeset(answer_type, attrs) do
    required_fields = [:slug]

    answer_type
    |> cast(attrs, required_fields)
    |> validate_required(required_fields)
  end
end

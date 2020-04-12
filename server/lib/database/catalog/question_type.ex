defmodule Database.Catalog.QuestionType do
  use Database.Model

  schema "question_types" do
    has_many :acts, Act

    field :slug, :string

    timestamps()
  end

  def changeset(question_type, attrs) do
    required_fields = [:slug]

    question_type
    |> cast(attrs, required_fields)
    |> validate_required(required_fields)
  end
end

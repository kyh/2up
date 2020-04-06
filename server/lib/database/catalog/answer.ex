defmodule Database.Catalog.Answer do
  use Database.Schema
  import Ecto.Changeset

  @answer_types %{
    text: 0,
    color: 1,
    drawing: 2
  }

  schema "answers" do
    belongs_to :question, Database.Catalog.Question

    field :content, :string

    timestamps()
  end

  def changeset(question, attrs) do
    required_fields = [:content]

    question
    |> cast(attrs, required_fields)
    |> validate_required(required_fields)
    |> assoc_constraint(:question)	
  end
end

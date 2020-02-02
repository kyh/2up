defmodule Playhouse.Catalog.Answer do
  use Ecto.Schema
  import Ecto.Changeset

  schema "answers" do
    belongs_to :question, Playhouse.Catalog.Question
    has_many :endorsements, Playhouse.Play.Endorsement

    field :content, :string

    timestamps()
  end

  def changeset(answer, attrs) do
    required_fields = [:content]

    answer
    |> cast(attrs, required_fields)
    |> validate_required(required_fields)
    |> assoc_constraint(:question)
  end
end

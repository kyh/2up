defmodule Database.Catalog.Question do
  use Ecto.Schema
  import Ecto.Changeset

  schema "questions" do
    belongs_to :user, Database.Catalog.User
    belongs_to :pack, Database.Catalog.Pack
    has_many :answers, Database.Catalog.Answer

    field :content, :string
    field :instruction, :string
    field :question_type, :integer

    timestamps()
  end

  def changeset(question, attrs) do
    required_fields = [:content, :instruction]

    question
    |> cast(attrs, required_fields)
    |> validate_required(required_fields)
    |> assoc_constraint(:user)	
    |> assoc_constraint(:act)	
  end
end

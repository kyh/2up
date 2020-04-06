defmodule Database.Catalog.Question do
  use Database.Schema
  import Ecto.Changeset

  @question_types %{
    text: 0,
    image: 1
  }

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

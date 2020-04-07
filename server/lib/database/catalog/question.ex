defmodule Database.Catalog.Question do
  use Database.Model

  schema "questions" do
    belongs_to :user, User
    belongs_to :pack, Pack
    has_many :answers, Answer

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

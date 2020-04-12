defmodule Database.Catalog.Act do
  use Database.Model

  schema "acts" do
    belongs_to :user, User
    belongs_to :parent, Act
    belongs_to :question_type, QuestionType
    belongs_to :answer_type, AnswerType

    field :question, :string
    field :answer, :string

    timestamps()
  end

  def changeset(act, attrs) do
    required_fields = [:question]

    act
    |> cast(attrs, required_fields)
    |> assoc_constraint(:user)	
    |> assoc_constraint(:question_type)	
    |> assoc_constraint(:answer_type)	
  end
end

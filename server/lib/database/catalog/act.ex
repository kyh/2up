defmodule Database.Catalog.Act do
  use Database.Model

  schema "acts" do
    belongs_to :user, User
    belongs_to :question_type, QuestionType
    belongs_to :answer_type, AnswerType

    field :question, :string
    field :answer, :string
    field :instruction, :string

    timestamps()
  end

  def changeset(act, attrs) do
    required_fields = [:question, :answer, :instruction]
    optional_fields = [:question_type_id, :answer_type_id]

    act
    |> cast(attrs, required_fields ++ optional_fields)
    |> assoc_constraint(:user)
    |> assoc_constraint(:question_type)
    |> assoc_constraint(:answer_type)
  end
end

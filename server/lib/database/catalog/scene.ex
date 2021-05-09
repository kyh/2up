defmodule Database.Catalog.Scene do
  use Database.Model

  schema "scenes" do
    has_many :scenes_answers, SceneAnswer

    belongs_to :question_type, QuestionType
    belongs_to :answer_type, AnswerType

    field :question, :string
    field :instruction, :string

    timestamps()
  end

  def changeset(scene, attrs) do
    required_fields = [:question, :instruction]
    optional_fields = [:question_type_id, :answer_type_id]

    scene
    |> cast(attrs, required_fields ++ optional_fields)
    |> assoc_constraint(:question_type)
    |> assoc_constraint(:answer_type)
  end
end

defmodule Database.Catalog.Scene do
  use Database.Model

  schema "scenes" do
    has_many :scene_answers, SceneAnswer

    belongs_to :pack, Pack
    belongs_to :question_type, QuestionType
    belongs_to :answer_type, AnswerType

    field :question, :string
    field :instruction, :string
    field :order, :decimal

    timestamps()
  end

  def changeset(scene, attrs) do
    required_fields = [:question, :instruction, :order]

    scene
    |> cast(attrs, required_fields)
    |> assoc_constraint(:question_type)
    |> assoc_constraint(:answer_type)
  end
end

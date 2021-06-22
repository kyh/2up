defmodule Database.Catalog.Scene do
  use Database.Model

  schema "scenes" do
    has_many :scene_answers, SceneAnswer

    belongs_to :pack, Pack
    belongs_to :question_type, QuestionType, on_replace: :update
    belongs_to :answer_type, AnswerType, on_replace: :update

    field :question, :string
    field :instruction, :string
    field :order, :decimal
    field :external_id, :string

    timestamps()
  end

  def changeset(scene, attrs) do
    required_fields = [
      :question,
      :instruction,
      :order,
      :question_type_id,
      :answer_type_id,
      :external_id
    ]

    scene
    |> cast(attrs, required_fields)
    |> assoc_constraint(:question_type)
    |> assoc_constraint(:answer_type)
  end
end

defmodule Database.Catalog.SceneAnswer do
  use Database.Model

  schema "scene_answers" do
    belongs_to :scene, Scene

    field :content, :string
    field :is_correct, :boolean

    timestamps()
  end

  def changeset(scene_answer, attrs) do
    required_fields = [:content, :is_correct, :scene_id]

    scene_answer
    |> cast(attrs, required_fields)
    |> assoc_constraint(:scene)
  end
end

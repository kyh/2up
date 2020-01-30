defmodule Remote.Stage.Performance do
  use Ecto.Schema
  import Ecto.Changeset

  schema "performances" do
    belongs_to :scene, Remote.Catalog.Scene
    has_many :interactions, Remote.Stage.Interaction

    timestamps()
  end

  def changeset(response, attrs) do
    response
    |> cast(attrs, [])
    |> assoc_constraint(:scene)
  end
end

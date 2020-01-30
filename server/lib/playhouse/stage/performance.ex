defmodule Playhouse.Stage.Performance do
  use Ecto.Schema
  import Ecto.Changeset

  schema "performances" do
    belongs_to :scene, Playhouse.Catalog.Scene
    has_many :interactions, Playhouse.Stage.Interaction

    timestamps()
  end

  def changeset(response, attrs) do
    response
    |> cast(attrs, [])
    |> assoc_constraint(:scene)
  end
end

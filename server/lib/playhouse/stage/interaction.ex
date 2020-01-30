defmodule Playhouse.Stage.Interaction do
  use Ecto.Schema
  import Ecto.Changeset

  schema "interactions" do
    belongs_to :response, Playhouse.Catalog.Response
    belongs_to :character, Playhouse.Stage.Character
    belongs_to :performance, Playhouse.Stage.Performance

    timestamps()
  end

  def changeset(response, attrs) do
    response
    |> cast(attrs, [])
    |> assoc_constraint(:response)
    |> assoc_constraint(:character)
    |> assoc_constraint(:performance)
  end
end

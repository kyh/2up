defmodule Playhouse.Stage.Production do
  use Ecto.Schema
  import Ecto.Changeset

  schema "productions" do
    belongs_to :character, Playhouse.Stage.Character
    belongs_to :play, Playhouse.Catalog.Play
    has_many :characters, Playhouse.Stage.Character

    timestamps()
  end

  def changeset(response, attrs) do
    response
    |> cast(attrs, [])
    |> assoc_constraint(:play)
  end
end

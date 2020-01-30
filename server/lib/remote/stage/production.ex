defmodule Remote.Stage.Production do
  use Ecto.Schema
  import Ecto.Changeset

  schema "productions" do
    belongs_to :character, Remote.Stage.Character
    belongs_to :play, Remote.Catalog.Play
    has_many :characters, Remote.Stage.Character

    timestamps()
  end

  def changeset(response, attrs) do
    response
    |> cast(attrs, [])
    |> assoc_constraint(:play)
  end
end

defmodule Playhouse.Play.Game do
  use Ecto.Schema
  import Ecto.Changeset

  schema "games" do
    has_many :players, Playhouse.Play.Player
    has_many :game_questions, Playhouse.Play.GameQuestion

    field :act, :integer
    field :scene, :integer
    field :code, :string

    timestamps()
  end

  def changeset(game, attrs) do
    required_fields = [:act, :scene]

    game
    |> cast(attrs, required_fields)
    |> validate_required(required_fields)
  end
end

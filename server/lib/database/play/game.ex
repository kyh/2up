defmodule Database.Play.Game do
  use Ecto.Schema
  import Ecto.Changeset

  schema "games" do
    has_many :players, Database.Play.Player
    has_many :game_questions, Database.Play.GameQuestion

    field :code, :string

    timestamps()
  end

  def changeset(game, attrs) do
    required_fields = [:code]

    game
    |> cast(attrs, required_fields)
    |> validate_required(required_fields)
  end
end

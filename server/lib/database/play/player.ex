defmodule Database.Play.Player do
  use Ecto.Schema
  import Ecto.Changeset

  schema "players" do
    belongs_to :game, Database.Play.Game
    has_many :submissions, Database.Play.Submission

    field :name, :string
    field :score, :integer

    timestamps()
  end

  def changeset(player, attrs) do
    required_fields = [:name, :score]

    player
    |> cast(attrs, required_fields)
    |> validate_required(required_fields)
    |> assoc_constraint(:game)
  end
end

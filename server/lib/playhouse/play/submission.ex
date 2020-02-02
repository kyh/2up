defmodule Playhouse.Play.Submission do
  use Ecto.Schema
  import Ecto.Changeset

  schema "submissions" do
    belongs_to :player, Playhouse.Play.Player
    belongs_to :game_question, Playhouse.Play.GameQuestion
    has_many :endorsements, Playhouse.Play.Endorsement

    field :content, :string

    timestamps()
  end

  def changeset(submission, attrs) do
    required_fields = [:content]

    submission
    |> cast(attrs, required_fields)
    |> validate_required(required_fields)
    |> assoc_constraint(:player)
    |> assoc_constraint(:game_question)
  end
end

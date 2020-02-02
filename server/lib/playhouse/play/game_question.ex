defmodule Playhouse.Play.GameQuestion do
  use Ecto.Schema
  import Ecto.Changeset

  schema "game_questions" do
    belongs_to :game, Playhouse.Play.Game
    belongs_to :question, Playhouse.Catalog.Question
    has_many :submissions, Playhouse.Play.Submission

    timestamps()
  end

  def changeset(game_question, attrs) do
    game_question
    |> cast(attrs, [])
    |> assoc_constraint(:game)
    |> assoc_constraint(:question)
  end
end

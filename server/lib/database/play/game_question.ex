defmodule Database.Play.GameQuestion do
  use Ecto.Schema
  import Ecto.Changeset

  schema "game_questions" do
    belongs_to :game, Database.Play.Game
    belongs_to :question, Database.Catalog.Question
    has_many :submissions, Database.Play.Submission

    timestamps()
  end

  def changeset(game_question, attrs) do
    game_question
    |> cast(attrs, [])
    |> assoc_constraint(:game)
    |> assoc_constraint(:question)
  end
end

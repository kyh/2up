defmodule Trivia.Game do
  defstruct act: 0, scene: 0, questions: [], players: []

  alias Trivia.{Game}

  def new(questions, players) do
    %Game{questions: questions, players: players}
  end
end

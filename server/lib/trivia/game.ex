defmodule Trivia.Game do
  alias Trivia.{Act, Game, Player}

  defstruct act: 0, scene: 0, acts: [], players: []

  def new(question_sets, player_ids) do
    players = Enum.map player_ids, fn player_id ->
      %Player{id: player_id}
    end

    acts = Enum.map question_sets, fn question_set ->
      question = Enum.at(question_set, 0)
      answer = Enum.at(question_set, 1)
      %Act{ question: question, answer: answer }
    end

    %Game{acts: acts, players: players}
  end
end

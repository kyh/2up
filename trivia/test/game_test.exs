defmodule GameTest do
  use ExUnit.Case, async: true
  doctest Trivia.Game

  alias Trivia.{Game}

  setup do
    [
      players: [1, 2],
      questions: [
        ['What is blue?', 'Sky'],
        ['What is green?', 'Grass'],
        ['What is red?', 'Ketchup']
      ]
    ]
  end

  describe "creating a game" do
    test "with questions and players", context do
      player_count = Enum.count(context.players)
      question_count = Enum.count(context.questions)
      game = Game.new(context.questions, context.players)

      assert Enum.count(game.questions) == question_count
      assert Enum.count(game.players) == player_count
    end
  end
end

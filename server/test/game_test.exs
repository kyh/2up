defmodule GameTest do
  use ExUnit.Case, async: true
  doctest Game.Game

  alias Game.{Game}

  setup do
    [
      players: [1, 2],
      question_sets: [
        ['What is blue?', 'Sky'],
        ['What is green?', 'Grass'],
        ['What is red?', 'Ketchup']
      ]
    ]
  end

  describe "creating a game" do
    test "with questions and players", context do
      player_count = Enum.count(context.players)
      question_set_count = Enum.count(context.question_sets)

      game = Game.new(context.question_sets, context.players)

      assert Enum.count(game.acts) == question_set_count
      assert Enum.count(game.players) == player_count
    end
  end
end

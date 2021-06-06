defmodule Game.GamePlayTest do
  use ExUnit.Case, async: true
  doctest Game.GamePlay

  alias Game.GamePlay

  setup do
    [
      question_set: [
        %{
          answer_type: "text",
          instruction: nil,
          pack: "Capitals",
          question: "Thailand",
          question_type: "text",
          scene_answers: [%{content: "Bangkok", id: 94, isCorrect: true}],
          scene_id: 94
        },
        %{
          answer_type: "text",
          instruction: nil,
          pack: "Capitals",
          question: "Egypt",
          question_type: "text",
          scene_answers: [%{content: "Cairo", id: 86, isCorrect: true}],
          scene_id: 86
        }
      ]
    ]
  end

  describe "new/1" do
    test "with question set", context do
      question_count = Enum.count(context.question_set)
      game = GamePlay.new(context.question_set)

      assert Enum.count(game.scenes) == question_count
    end
  end

  describe "player_new/2" do
    test "new player join", context do
      player_name = "Player 1"
      initial_game = GamePlay.new(context.question_set)
      updated_game = GamePlay.player_new(initial_game, player_name)
      
      matched_players =
        Enum.filter(updated_game.players, & &1.name == player_name)

      assert Enum.count(matched_players) == 1
      assert Enum.at(matched_players, 0).name == player_name
      assert Enum.count(updated_game.players) == Enum.count(initial_game.players) + 1
    end
  end
end

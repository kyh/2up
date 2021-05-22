defmodule Game.GamePlay do
  @moduledoc """
  Main game logic
  """

  alias Game.{Scene, GamePlay, Player}

  defstruct scene: 0, step: 0, scenes: [], players: [], pack: ""

  def new(question_sets, player_ids) do
    players =
      Enum.map(player_ids, fn player_id ->
        %Player{id: player_id}
      end)

    scenes =
      Enum.map(question_sets, fn question_set ->
        %{
          question: question,
          scene_answers: scene_answers,
          pack: pack,
          instruction: instruction,
          question_type: question_type,
          answer_type: answer_type
        } = question_set

        %Scene{
          question: question,
          question_type: question_type,
          scene_answers: scene_answers,
          answer_type: answer_type,
          pack: pack,
          instruction: instruction,
          submissions: []
        }
      end)

    %GamePlay{scenes: scenes, players: players}
  end

  def player_new(game, player) do
    new_players =
      (game.players ++ [player])
      |> Enum.uniq_by(fn player -> player.name end)

    %{game | players: new_players}
  end

  def next_step_get(game, submissions_length, player_count) do
    case submissions_length >= player_count do
      true -> game.step + 1
      false -> game.step
    end
  end

  def points_calculate(scene_answers, submission) do
    correct_submission_count =
      scene_answers
      |> Enum.filter(& &1.isCorrect)
      |> Enum.filter(&(&1.content == submission["content"]))
      |> Enum.count()

    case correct_submission_count > 0 do
      true ->
        %{game | scenes: new_scenes, step: current_step}
        |> player_add_score(name, 100)

      false ->
        %{game | scenes: new_scenes, step: current_step}
    end
  end

  def player_submit(game, name, submission, player_count) do
    current_index = game.scene - 1
    current_scene = Enum.at(game.scenes, current_index)

    new_submissions = Enum.shuffle(current_scene.submissions ++ [submission])
    new_scenes = List.update_at(game.scenes, current_index, &%{&1 | submissions: new_submissions})
    current_step = next_step_get(game, length(new_submissions), player_count)

    points_calculate(current_scene.scene_answers, submission)
  end

  def player_add_score(game, name, score) do
    player =
      Enum.filter(game.players, fn x -> x.name === name end)
      |> Enum.at(0)

    new_player = %{player | score: player.score + score}

    new_players =
      Enum.map(game.players, fn x ->
        case x.name == name do
          true -> new_player
          false -> x
        end
      end)

    %{game | players: new_players}
  end

  def step_next(game) do
    %{game | step: game.step + 1}
  end

  def scene_next(game) do
    case length(game.scenes) == game.scene do
      true -> %{game | scene: 0, step: 0}
      false -> %{game | scene: game.scene + 1, step: 1}
    end
  end

  def start(game) do
    %{game | scene: 1, step: 1}
  end
end

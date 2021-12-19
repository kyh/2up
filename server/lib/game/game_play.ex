defmodule Game.GamePlay do
  @moduledoc """
  Question and answer game logic
  """

  alias Game.{Scene, GamePlay, Player}

  defstruct scene: 0, step: 0, scenes: [], players: [], pack: "", start_time: 0, duration: 45000

  @doc """
  Initializes game play struct with scenes and players
  """
  def new(question_sets) do
    scenes = scenes_initialize(question_sets)

    %GamePlay{scenes: scenes}
  end

  @doc """
  Converts question sets into Scene structs
  """
  def scenes_initialize(question_sets) do
    Enum.map(question_sets, &Scene.new(&1))
  end

  @doc """
  Adds new player to game play struct if name is unique
  """
  def player_new(game, name) do
    new_players =
      (game.players ++ [%Player{name: name}])
      |> Enum.uniq_by(fn player -> player.name end)

    %{game | players: new_players}
  end

  @doc """
  Moves to next step if all players have submitted
  """
  def next_step_get(game, submissions_length, player_count) do
    case submissions_length >= player_count do
      true -> game.step + 1
      false -> game.step
    end
  end

  @doc """
  Increment 100 points for each correct answer
  """
  def points_calculate(game, current_index, name, submission) do
    get_current_scene(game, current_index)
    |> Map.get(:scene_answers)
    |> Enum.filter(& &1.isCorrect)
    |> Enum.filter(&compare_content(&1, submission))
    |> Enum.count()
    |> update_scores(game, name)
  end

  defp get_current_scene(game, current_index) do
    Enum.at(game.scenes, current_index)
  end

  defp compare_content(scene_answer, submission) do
    String.upcase(scene_answer.content) |> String.trim() ==
      String.upcase(submission["content"]) |> String.trim()
  end

  # Update scores based on correctness and speed of submission
  defp update_scores(correct_submission_count, game, name) do
    case correct_submission_count > 0 do
      true ->
        current_timestamp = get_timestamp()
        start_time = game.start_time
        difference = current_timestamp - start_time

        bonus_points =
          case difference < game.duration do
            true ->
              round((game.duration - difference) / game.duration * 100)

            false ->
              0
          end

        player_score_add(game, name, 100 + bonus_points)

      false ->
        game
    end
  end

  @doc """
  Update game play state with submission. Move to next step if all submissions received.
  """
  def submissions_update(game, current_index, submission, player_count) do
    current_scene = get_current_scene(game, current_index)
    new_submissions = Enum.shuffle(current_scene.submissions ++ [submission])
    new_scenes = List.update_at(game.scenes, current_index, &%{&1 | submissions: new_submissions})
    current_step = next_step_get(game, length(new_submissions), player_count)

    %{game | scenes: new_scenes, step: current_step}
  end

  @doc """
  Update points and submissions with new submission
  """
  def player_submit(game, name, submission, player_count) do
    current_index = game.scene - 1

    game
    |> points_calculate(current_index, name, submission)
    |> submissions_update(current_index, submission, player_count)
  end

  @doc """
  Add points to player and update players list
  """
  def player_score_add(game, name, score) do
    player =
      Enum.filter(game.players, fn x -> x.name === name end)
      |> Enum.at(0)

    new_player = %Player{player | prev_score: player.score, score: player.score + score}

    new_players =
      Enum.map(game.players, fn x ->
        case x.name == name do
          true -> new_player
          false -> x
        end
      end)

    %{game | players: new_players}
  end

  @doc """
  Moves to the next step
  """
  def step_next(game) do
    case length(game.scenes) == game.scene do
      true ->
        # Move directly into score page after answering last question
        %{game | scene: 0, step: 0}

      false ->
        %{game | step: game.step + 1}
    end
  end

  @doc """
  Move to next scene unless it's end of game
  """
  def scene_next(game) do
    %{game | scene: game.scene + 1, step: 1, start_time: get_timestamp()}
  end

  @doc """
  Start game play with first scene and step
  """
  def start(game) do
    %{game | scene: 1, step: 1, start_time: get_timestamp()}
  end

  defp get_timestamp() do
    :os.system_time(:millisecond)
  end
end

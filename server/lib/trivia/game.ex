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

  def player_new(game, player) do
    new_players = game.players ++ [player]
    %{game | players: new_players}
  end

  def player_submit(game, submission) do
    new_submission = [submission]
    current_index = game.act - 1
    current_act = Enum.at(game.acts, current_index)
    current_submissions = current_act.submissions
    new_submissions = current_submissions ++ new_submission 
    updated_act = %{current_act | submissions: new_submissions}

    new_acts =
    game.acts
    |> Enum.with_index
    |> Enum.map(fn {x,i} ->
      if i == 0 do
        updated_act
      else
        x
      end
    end)

    current_scene = 
    if length(new_submissions) === length(game.players) do
      game.scene + 1
    else
      game.scene
    end

    %{game | acts: new_acts, scene: current_scene}
  end

  def start(game) do
    %{game | act: 1, scene: 1}
  end
end

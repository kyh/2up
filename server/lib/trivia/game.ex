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

      submission = %{
        id: Ecto.UUID.generate,
        name: "IS_ANSWER",
        content: answer,
        endorsers: []
      }

      %Act{ question: question, answer: answer, submissions: [submission] }
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
    if length(new_submissions) === length(game.players) + 1 do
      game.scene + 1
    else
      game.scene
    end

    %{game | acts: new_acts, scene: current_scene}
  end

  def player_endorse(game, name, submission_id) do
    player =
      Enum.filter(game.players, fn x -> x.name === name end)
      |> Enum.at(0)

    current_index = game.act - 1
    current_act = Enum.at(game.acts, current_index)

    submission =
      Enum.filter(current_act.submissions, fn x -> x.id === submission_id end)
      |> Enum.at(0)

    new_endorsers = submission.endorsers ++ [player]
    new_submission = %{submission | endorsers: new_endorsers}

    new_submissions =
    current_act.submissions
    |> Enum.map(fn x ->
      if x.id === submission_id do
        new_submission
      else
        x
      end
    end)

    new_acts =
    game.acts
    |> Enum.with_index
    |> Enum.map(fn {x,i} ->
      if i === current_index do
        %{x | submissions: new_submissions}
      else
        x
      end
    end)

    endorsement_length = Enum.map(new_submissions, fn x -> length(x.endorsers) end)
    |> Enum.sum

    current_scene = 
    if endorsement_length === length(game.players) do
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

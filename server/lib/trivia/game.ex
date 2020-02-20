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
    new_players =
      game.players ++ [player]
      |> Enum.uniq_by(fn player -> player.name end)

    %{game | players: new_players}
  end

  def player_submit(game, submission) do
    new_submission = [submission]
    current_index = game.act - 1
    current_act = Enum.at(game.acts, current_index)
    current_submissions = current_act.submissions
    new_submissions = Enum.shuffle(current_submissions ++ new_submission)
    updated_act = %{current_act | submissions: new_submissions}

    new_acts =
      game.acts
      |> Enum.with_index
      |> Enum.map(fn {x,i} ->
        case i == current_index do
          true -> updated_act
          false -> x
        end
      end)

    current_scene = 
      case length(new_submissions) == length(game.players) + 1 do
        true -> game.scene + 1
        false -> game.scene
      end

    %{game | acts: new_acts, scene: current_scene}
  end

  def player_add_coins(game, name, coins) do
    player =
      Enum.filter(game.players, fn x -> x.name === name end)
      |> Enum.at(0)
    
    new_player = %{player | coins: player.coins + coins}

    new_players =
      Enum.map(game.players, fn x ->
        case x.name == name do
          true -> new_player
          false -> x
        end
      end)
    
    %{game | players: new_players}
  end

  def player_endorse(game, name, submission_id) do
    current_index = game.act - 1
    current_act = Enum.at(game.acts, current_index)

    submission =
      Enum.filter(current_act.submissions, fn x -> x.id === submission_id end)
      |> Enum.at(0)

    updated_game =
      case submission.name == "IS_ANSWER" do
        true -> player_add_coins(game, name, 1000)
        false -> player_add_coins(game, submission.name, 500)
      end

    player =
      Enum.filter(updated_game.players, fn x -> x.name === name end)
      |> Enum.at(0)

    new_endorsers = submission.endorsers ++ [player]
    new_submission = %{submission | endorsers: new_endorsers}

    new_submissions =
      current_act.submissions
      |> Enum.map(fn x ->
        case x.id == submission_id do
          true -> new_submission
          false -> x
        end
      end)

    new_acts =
      updated_game.acts
      |> Enum.with_index
      |> Enum.map(fn {x,i} ->
        case i == current_index do
          true -> %{x | submissions: new_submissions}
          false -> x
        end
      end)

    endorsement_length =
      Enum.map(new_submissions, fn x -> length(x.endorsers) end)
      |> Enum.sum

    current_scene = 
      case endorsement_length == length(updated_game.players) do
        true -> updated_game.scene + 1
        false -> updated_game.scene 
      end

    %{updated_game | acts: new_acts, scene: current_scene}
  end

  def scene_next(game) do
    %{game | scene: game.scene + 1}
  end

  def act_next(game) do
    case length(game.acts) == game.act do
      true -> %{game | act: 0, scene: 0}
      false -> %{game | act: game.act + 1, scene: 1}
    end
  end

  def start(game) do
    %{game | act: 1, scene: 1}
  end
end

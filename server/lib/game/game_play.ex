defmodule Game.GamePlay do
  @moduledoc """
  Main game logic
  """

  alias Game.{Act, GamePlay, Player}

  defstruct act: 0, scene: 0, acts: [], players: [], pack: ""

  # TODO: Move out once we migrate off of Airtable
  @pack_map %{
    "Startups": "Give a one line description of this startup",
    "SAT": "Give a short definition of this word"
  }

  def new(question_sets, player_ids, initial_pack) do
    players = Enum.map player_ids, fn player_id ->
      %Player{id: player_id}
    end

    acts = Enum.map question_sets, fn question_set ->
      question = Enum.at(question_set, 0)
      answer = Enum.at(question_set, 1)
      pack = Enum.at(question_set, 2) |> Enum.at(0)
      instruction = Map.get(@pack_map, String.to_atom(pack))

      submission = %{
        id: Ecto.UUID.generate,
        name: "IS_ANSWER",
        content: answer,
        endorsers: []
      }

      answer_type = get_answer_type(pack)

      act = %Act{
        question: question,
        question_type: "text",
        answer: answer,
        answer_type: answer_type,
        pack: pack,
        instruction: instruction,
        submissions: [submission]
      }
    end

    case initial_pack do
      "Variety" ->
        acts = List.replace_at(acts, 1, generate_color_act())
          |> List.replace_at(7, generate_color_act())
        %GamePlay{acts: acts, players: players, pack: initial_pack}
      "Color" ->
        acts = Enum.map(0..9, fn _ -> generate_color_act() end)
        %GamePlay{acts: acts, players: players, pack: initial_pack}
      _ -> 
        %GamePlay{acts: acts, players: players, pack: initial_pack}
    end
  end

  def get_answer_type(pack) do
    case pack do
      "Drawing" -> "drawing"
      _ -> "text"
    end
  end

  def generate_random_color() do
    letters = "0123456789ABCDEF"
    color = letters
      |> String.split("", trim: true)
      |> Enum.shuffle
      |> Enum.take(6)
      |> Enum.join("")
    "#" <> color
  end

  def generate_color_act() do
    random_color = generate_random_color()
    %Act{
      question: random_color,
      question_type: "text",
      answer: random_color,
      answer_type: "color",
      pack: "Color",
      instruction: "What is the color of this hex?",
      submissions: [
        %{
          id: Ecto.UUID.generate,
          name: "IS_ANSWER",
          content: random_color,
          endorsers: []
        }
      ]
    }
  end

  def player_new(game, player) do
    new_players =
      game.players ++ [player]
      |> Enum.uniq_by(fn player -> player.name end)

    %{game | players: new_players}
  end

  def player_submit(game, submission, player_count) do
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
      # Extra player count for correct answer submission
      case length(new_submissions) >= player_count + 1 do
        true -> game.scene + 1
        false -> game.scene
      end

    %{game | acts: new_acts, scene: current_scene}
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

  def player_endorse(game, name, submission_id, player_count) do
    current_index = game.act - 1
    current_act = Enum.at(game.acts, current_index)

    submission =
      Enum.filter(current_act.submissions, fn x -> x.id === submission_id end)
      |> Enum.at(0)

    updated_game =
      case submission.name == "IS_ANSWER" do
        true -> player_add_score(game, name, 1000)
        false -> player_add_score(game, submission.name, 500)
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
      case endorsement_length >= player_count do
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

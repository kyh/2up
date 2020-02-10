defmodule Playhouse.Play do
  import Ecto.Query

  alias Playhouse.Repo
  alias Playhouse.Catalog
  alias Playhouse.Catalog.{ Question, Answer }
  alias Playhouse.Play
  alias Playhouse.Play.{
    Game,
    Player,
    Submission,
    GameQuestion,
    Endorsement
  }

  def player_list(game) do
    query =
      from player in Player,
      select: map(player, [:id, :name, :coins]),
      where: player.game_id == ^game.id

    Repo.all(query)
  end

  def players(game) do
    query =
      from player in Player,
      where: player.game_id == ^game.id

    Repo.all(query)
  end

  def player_create(game, name) do
    %Player{
      game: game,
      name: name,
      coins: 0
    } |> Repo.insert!
  end

  def player_get(name, code) do
    game = game_get(code)
    Repo.get_by(Player, name: name, game_id: game.id)
  end

  def player_find_or_create(game, name) do
    existing_player = player_get(name, game.code)

    if existing_player do
      existing_player
    else
      player_create(game, name)
    end
  end

  def submission_get(id) do
    Repo.get_by(Submission, id: id)
  end

  def submission_create(player, submission) do
    game = Repo.get_by(Game, id: player.game_id)

    %Submission{
      player: player,
      content: submission,
      game_question: last_game_question(game)
    } |> Repo.insert!
  end

  def submission_list(game_question) do
    query =
      from submission in Submission,
      preload: [:player],
      where: submission.game_question_id == ^game_question.id

    Repo.all(query)
  end

  def endorsement_list(game_question) do
    query =
      from endorsement in Endorsement,
      select: map(endorsement, [:id, :player_id, :submission_id, :answer_id]),
      left_join: submission in assoc(endorsement, :submission), on: endorsement.submission_id == submission.id,
      left_join: answer in assoc(endorsement, :answer), on: endorsement.answer_id == answer.id,
      where: submission.game_question_id == ^game_question.id or answer.question_id == ^game_question.question_id

    Repo.all(query)
  end

  def endorsement_create(player, submission) do
    %Endorsement{
      player: player,
      submission: submission
    } |> Repo.insert!
  end

  def endorsement_answer_create(player, answer) do
    %Endorsement{
      player: player,
      answer: answer
    } |> Repo.insert!
  end

  def endorsement_create(player, submission, answer) do
    %Endorsement{
      player: player,
      submission: submission,
      answer: answer
    } |> Repo.insert!
  end

  def game_create() do
    code = Catalog.generate_code()
    question = Catalog.random_question()

    game = %Game{ act: 0, scene: 0, code: code } |> Repo.insert!
    %GameQuestion{ question: question, game: game } |> Repo.insert!

    game
  end

  def game_scene_next(game) do
    game
    |> Ecto.Changeset.change(%{ scene: game.scene + 1 })
    |> Repo.update
    |> elem(1)
  end

  def game_act_next(game) do
    game
    |> Ecto.Changeset.change(%{ act: game.act + 1, scene: 1 })
    |> Repo.update
    |> elem(1)
  end

  def game_get(code) do
    Repo.get_by(Game, code: code)
  end

  def game_state(game) do
    game_question = last_game_question(game)
    question = Repo.get_by(Question, id: game_question.question_id)
    answer = Repo.get_by(Answer, question_id: question.id)
    submissions = Play.submission_list(game_question)
    endorsements = Play.endorsement_list(game_question)
    players = player_list(game)

    submissions_list = Enum.map submissions, fn submission -> 
      player_ids =
        Enum.filter(endorsements, fn x -> x.submission_id == submission.id end)
        |> Enum.map(fn x -> x.player_id end)

      players = Enum.filter(players, fn x -> Enum.member?(player_ids, x.id) end)

      %{
        id: submission.id,
        name: submission.player.name,
        content: submission.content,
        endorsers: players
      }
    end

    smart_player_ids =
      Enum.filter(endorsements, fn x -> x.answer_id == answer.id end)
      |> Enum.map(fn x -> x.player_id end)

    smart_players = Enum.filter(players, fn x -> Enum.member?(smart_player_ids, x.id) end)

    answer_submission = %{
      id: answer.id,
      name: "IS_ANSWER",
      content: answer.content,
      endorsers: smart_players
    }

    formatted_submissions = List.insert_at(submissions_list, 0, answer_submission)

    %{
      gameID: game.code,
      act: game.act,
      scene: game.scene,
      question: question.content,
      answer: answer.content,
      players: players,
      submissions: Enum.shuffle(formatted_submissions)
    }
  end

  def last_game_question(game) do
    query =
      from game_question in GameQuestion,
      where: game_question.game_id == ^game.id,
      order_by: [desc: game_question.inserted_at],
      preload: [:question],
      limit: 1

    Repo.one(query)
  end

  def game_question_create(game) do
    question = Catalog.random_question()
    %GameQuestion{ question: question, game: game } |> Repo.insert!
  end

  def setup_payload(payload) do
    player = Play.player_get(payload["name"], payload["gameID"])
    game = Play.game_get(payload["gameID"])
    game_question = Play.last_game_question(game)
    question = game_question.question

    query =
      from answer in Answer,
      where: answer.question_id == ^question.id,
      limit: 1

    answer = Repo.one(query)

    [player, game, game_question, answer]
  end

  def collected_all_submissions(game, game_question) do
    submissions = Play.submission_list(game_question)
    players = Play.player_list(game)

    length(submissions) == length(players)
  end

  def collected_all_endorsements(game, game_question) do
    endorsements = Play.endorsement_list(game_question)
    players = Play.player_list(game)

    length(endorsements) == length(players)
  end

  def coins_update(game, game_question, answer) do
    submissions = Play.submission_list(game_question)
    endorsements = Play.endorsement_list(game_question)

    smart_endorsements =
      Enum.filter(endorsements, fn x -> x.answer_id == answer.id end)

    players = Play.players(game)

    Enum.each players, fn player ->
      smart_endorsement = Enum.find(smart_endorsements, fn x -> x.player_id == player.id end)

      if smart_endorsement do
        smart_player = Repo.get(Player, smart_endorsement.player_id)
        smart_player
          |> Ecto.Changeset.change(%{ coins: smart_player.coins + 1000 })
          |> Repo.update
      end

      submission = Enum.find(submissions, fn x -> x.player_id == player.id end)

      tricked_players = Enum.filter(endorsements, fn x -> x.submission_id == submission.id end)

      player
        |> Ecto.Changeset.change(%{ coins: player.coins + length(tricked_players) * 500 })
        |> Repo.update
    end
  end
end

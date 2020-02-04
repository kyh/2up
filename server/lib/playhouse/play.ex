defmodule Playhouse.Play do
  import Ecto.Query

  alias Playhouse.Repo
  alias Playhouse.Catalog
  alias Playhouse.Catalog.{ Question }
  alias Playhouse.Play
  alias Playhouse.Play.{ Game, Player, Submission, GameQuestion }

  def player_list(game) do
    query =
      from player in Player,
      select: map(player, [:id, :name, :score]),
      where: player.game_id == ^game.id

    Repo.all(query)
  end

  def player_create(game, name) do
    %Player{
      game: game,
      name: name,
      score: 0
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
      select: map(submission, [:id, :content]),
      where: submission.game_question_id == ^game_question.id

    Repo.all(query)
  end

  def game_create() do
    code = Catalog.generate_code()
    question = Catalog.random_question()

    game = %Game{ act: 1, scene: 1, code: code } |> Repo.insert!
    %GameQuestion{ question: question, game: game } |> Repo.insert!

    game
  end

  def game_scene_next(game) do
    game
    |> Ecto.Changeset.change(%{ scene: game.scene + 1 })
    |> Repo.update()
  end

  def game_get(code) do
    Repo.get_by(Game, code: code)
  end

  def game_state(game) do
    game_question = last_game_question(game)
    question = Repo.get_by(Question, id: game_question.question_id)
    submissions = Play.submission_list(game_question)
    players = player_list(game)

    %{
      gameID: game.code,
      act: game.act,
      scene: game.scene,
      question: question.content,
      players: players,
      submissions: submissions
    }
  end

  def last_game_question(game) do
    query =
      from game_question in GameQuestion,
      where: game_question.game_id == ^game.id,
      order_by: [desc: game_question.inserted_at],
      limit: 1

    Repo.one(query)
  end
end

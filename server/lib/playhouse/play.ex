defmodule Playhouse.Play do
  import Ecto.Query

  alias Playhouse.Repo
  alias Playhouse.Catalog
  alias Playhouse.Catalog.Question
  alias Playhouse.Play.Game
  alias Playhouse.Play.Player
  alias Playhouse.Play.Submission
  alias Playhouse.Play.GameQuestion

  def player_list do
    playersQuery =
      from q in Player, select: map(q, [:id, :name, :score])

    Repo.all(playersQuery)
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
    last_game_question =
      Repo.one(from x in GameQuestion, order_by: [desc: x.inserted_at], limit: 1)

    %Submission{
      player: player,
      content: submission,
      game_question: last_game_question
    } |> Repo.insert!
  end

  def submission_list do
    submissionsQuery =
      from q in Submission, select: map(q, [:id, :content])

    Repo.all(submissionsQuery)
  end

  def game_create() do
    code = Catalog.generate_code()
    question = Catalog.random_question()

    game = %Game{
      act: 1,
      scene: 1,
      code: code
    } |> Repo.insert!

    %GameQuestion{
      question: question,
      game: game
    } |> Repo.insert!

    game
  end

  def game_scene_next(game) do
    game
    |> Ecto.Changeset.change(%{ scene: 2 })
    |> Repo.update()
  end

  def game_get(code) do
    Repo.get_by(Game, code: code)
  end

  def game_state(game) do
    last_game_question =
      Repo.one(from x in GameQuestion, order_by: [desc: x.inserted_at], limit: 1)

    question = Repo.get_by(Question, id: last_game_question.question_id)

    players = player_list()

    %{
      gameID: game.code,
      act: game.act,
      scene: game.scene,
      question: question.content,
      players: players
    }
  end
end

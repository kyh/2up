defmodule Playhouse.Play do
  import Ecto.Query

  alias Playhouse.Repo
  alias Playhouse.Catalog
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

  def player_get(name) do
    Repo.get_by(Player, name: name)
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
      from q in Submission, select: map(q, [:id, :content, :score])

    Repo.all(submissionsQuery)
  end

  def game_create() do
    uuid = Ecto.UUID.generate
    four_char = String.slice(uuid, 0, 4)
    code = String.upcase(four_char)

    %Game{
      act: 1,
      scene: 1,
      code: code
    } |> Repo.insert!
  end

  def game_scene_next(_game) do
    Repo.one(Game)
    # increment scene counter
  end

  def game_state(game) do
    question = Catalog.random_question()
    players = player_list()

    %{
      gameID: game.id,
      code: game.code,
      act: game.act,
      scene: game.scene,
      question: question.content,
      players: players
    }
  end
end

defmodule Playhouse.Play do	
  import Ecto.Query

  alias Playhouse.Repo
  alias Playhouse.Catalog
  alias Playhouse.Play.Player

  def players_all do
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

  def game_state(game) do
    question = Catalog.random_question()
    players = players_all()

    %{
      act: game.act,
      scene: game.scene,
      question: question.content,
      players: players 
    }
  end
end

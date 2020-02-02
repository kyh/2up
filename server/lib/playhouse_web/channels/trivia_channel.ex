defmodule PlayhouseWeb.TriviaChannel do
  use PlayhouseWeb, :channel

  import Ecto.Query

  alias Playhouse.Repo
  alias Playhouse.Game
  alias Playhouse.Player
  alias Playhouse.Question
  alias PlayhouseWeb.Presence

  require Logger

  def join("game:trivia", payload, socket) do
    send(self(), :after_join)
    {:ok, socket}
  end

  def handle_in("ping", payload, socket) do
    {:reply, {:ok, payload}, socket}
  end

  def handle_in("game:join", payload, socket) do
    game = Repo.one(Game)

    if payload["name"] do
      %Player{
        game: game,
        name: payload["name"],
        score: 0
      } |> Repo.insert!
    end

    query =
      from Question,
      order_by: fragment("RANDOM()") ,
      limit: 1

    question = Repo.one(query)

    playersQuery = from q in Player, select: map(q, [:id, :name, :score])

    players = Repo.all(playersQuery)

    response = %{
      act: game.act,
      scene: game.scene,
      question: question.content,
      players: players 
    }

    broadcast socket, "game", response
  end

  def handle_in("player:submit", payload, socket) do
    broadcast socket, "player:submit", payload

    # find user with name payload.name
    # create submission
    # get all submissions
    # get all players

    # TODO: if submissions == amount of players
    # broadcast socket, "game", payload

    {:noreply, socket}
  end

  # TODO: player:join
  # TODO: game:create
  # TODO: player:endorse
  # TODO: game:next
end

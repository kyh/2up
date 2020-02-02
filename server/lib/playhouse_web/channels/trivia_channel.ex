defmodule PlayhouseWeb.TriviaChannel do
  use PlayhouseWeb, :channel

  import Ecto.Query

  alias Playhouse.Repo
  alias Playhouse.Play.Game
  alias Playhouse.Play.Player
  alias Playhouse.Catalog.Question
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

    question = Playhouse.Catalog.random_question()
    players = Playhouse.Play.players_all

    response = %{
      act: game.act,
      scene: game.scene,
      question: question.content,
      players: players 
    }

    broadcast socket, "game", response
    {:noreply, socket}
  end

  def handle_in("player:submit", payload, socket) do
    broadcast socket, "player:submit", payload

    # find user with name payload.name
    # create submission
    # get all submissions
    # get all players

    # TODO: if submissions == amount of players
    # move to the next scene
    # broadcast socket, "game", payload

    {:noreply, socket}
  end

  # TODO: player:join
  # TODO: game:create
  # TODO: player:endorse
    # once endorsements == amount of players
    # return game state (act, scene)
  # TODO: game:next
    # create new game question
    # return game state (act, scene)
end

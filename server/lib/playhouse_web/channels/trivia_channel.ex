defmodule PlayhouseWeb.TriviaChannel do
  use PlayhouseWeb, :channel

  alias Playhouse.Repo
  alias Playhouse.Play
  alias Playhouse.Play.Game

  require Logger

  def join("game:trivia", _payload, socket) do
    send(self(), :after_join)
    {:ok, socket}
  end

  def handle_in("ping", payload, socket) do
    {:reply, {:ok, payload}, socket}
  end

  def handle_in("game:new", payload, socket) do
    game = Play.game_create()
    Play.player_create(game, payload["name"])
    game_state = Play.game_state(game)

    broadcast socket, "game", game_state
    {:noreply, socket}
  end

  def handle_in("game:join", payload, socket) do
    game = Repo.one(Game)

    if payload["name"] do
      Play.player_create(game, payload["name"])
    end

    game_state = Play.game_state(game)

    broadcast socket, "game", game_state
    {:noreply, socket}
  end

  def handle_in("player:submit", payload, socket) do
    broadcast socket, "player:submit", payload

    player = Play.player_get(payload["name"])
    Play.submission_create(player, payload["submission"])
    submissions = Play.submission_list()
    players = Play.player_list()

    if length(submissions) == length(players) do
      game = Repo.one(Game)
      Play.game_scene_next(game)
      broadcast socket, "game", payload
    end

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

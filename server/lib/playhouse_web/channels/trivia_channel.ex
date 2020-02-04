defmodule PlayhouseWeb.TriviaChannel do
  use PlayhouseWeb, :channel

  alias Playhouse.Play

  def join("game:trivia", _payload, socket) do
    {:ok, socket}
  end

  def handle_in("game:new", payload, socket) do
    game = Play.game_create()
    Play.player_find_or_create(game, payload["name"])

    broadcast socket, "game", Play.game_state(game)
    {:noreply, socket}
  end

  def handle_in("game:join", payload, socket) do
    game = Play.game_get(payload["gameID"])
    Play.player_find_or_create(game, payload["name"])

    broadcast socket, "game", Play.game_state(game)
    {:noreply, socket}
  end

  def handle_in("player:submit", payload, socket) do
    player = Play.player_get(payload["name"], payload["gameID"])
    Play.submission_create(player, payload["submission"])

    game = Play.game_get(payload["gameID"])
    game_question = Play.last_game_question(game)
    submissions = Play.submission_list(game_question)
    players = Play.player_list(game)

    if length(submissions) == length(players) do
      Play.game_get(payload["gameID"]) |> Play.game_scene_next
      game = Play.game_get(payload["gameID"])
      broadcast socket, "game", Play.game_state(game)
    end

    {:noreply, socket}
  end

  # TODO: player:endorse
    # once endorsements == amount of players
    # return game state (act, scene)
  # TODO: game:next
    # create new game question
    # return game state (act, scene)
end

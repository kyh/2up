defmodule PlayhouseWeb.TriviaChannel do
  use PlayhouseWeb, :channel

  alias Playhouse.Play

  def join("game:trivia", _payload, socket) do
    {:ok, socket}
  end

  def handle_in("game:new", _payload, socket) do
    game = Play.game_create()

    push socket, "game", Play.game_state(game)
    {:noreply, socket}
  end

  def handle_in("game:join", payload, socket) do
    game = Play.game_get(payload["gameID"])
    Play.player_find_or_create(game, payload["name"])

    broadcast socket, "game", Play.game_state(game)
    {:noreply, socket}
  end

  def handle_in("game:start", payload, socket) do
    game = Play.game_get(payload["gameID"])

    game_state =
      game
      |> Play.game_act_next
      |> Play.game_state

    broadcast socket, "game", game_state
    {:noreply, socket}
  end

  def handle_in("player:submit", payload, socket) do
    [player, game, game_question, _answer] = Play.setup_payload(payload)
    Play.submission_create(player, payload["submission"])

    if Play.collected_all_submissions(game, game_question) do
      game_state =
        game
        |> Play.game_scene_next
        |> Play.game_state

      broadcast socket, "game", game_state
    end

    {:noreply, socket}
  end

  def handle_in("player:endorse", payload, socket) do
    [player, game, game_question, answer] = Play.setup_payload(payload)
    submission = Play.submission_get(payload["submissionID"])

    if payload["isAnswer"] == true do
      Play.endorsement_answer_create(player, answer)
    else
      Play.endorsement_create(player, submission)
    end

    if Play.collected_all_endorsements(game, game_question) do
      Play.coins_update(game, game_question, answer)

      game_state =
        game
        |> Play.game_scene_next
        |> Play.game_state

      broadcast socket, "game", game_state
    end

    {:noreply, socket}
  end

  def handle_in("game:next", payload, socket) do
    game = Play.game_get(payload["gameID"])

    game |> Play.game_question_create

    game_state =
      game
      |> Play.game_act_next
      |> Play.game_state

    broadcast socket, "game", game_state
    {:noreply, socket}
  end
end

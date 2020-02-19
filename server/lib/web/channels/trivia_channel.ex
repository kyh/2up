defmodule Web.TriviaChannel do
  use Web, :channel

  alias Trivia.{GameServer}
  alias Database.{Play}

  def join("trivia:" <> game_code, _payload, socket) do
    case GameServer.game_pid(game_code) do
      pid when is_pid(pid) ->
        send(self(), {:after_join, game_code})
        {:ok, socket}

      nil ->
        {:error, %{reason: "Game does not exist"}}
    end
  end

  def handle_info({:after_join, game_code}, socket) do
    game_state = GameServer.game_state(game_code)
    push(socket, "trivia/game_state", game_state)
    {:noreply, socket}
  end

  def handle_in("player:new", %{"name" => name}, socket) do
    "trivia:" <> game_code = socket.topic

    case GameServer.game_pid(game_code) do
      pid when is_pid(pid) ->
        player = %{ id: Ecto.UUID.generate, name: name, coins: 0 }
        game_state = GameServer.player_new(game_code, player)
        broadcast!(socket, "trivia/game_state", game_state)
        {:noreply, socket}

      nil ->
        {:reply, {:error, %{reason: "Game does not exist"}}, socket}
    end
  end

  def handle_in("start", _payload, socket) do
    "trivia:" <> game_code = socket.topic

    case GameServer.game_pid(game_code) do
      pid when is_pid(pid) ->
        game_state = GameServer.game_start(game_code)
        broadcast!(socket, "trivia/game_state", game_state)
        {:noreply, socket}

      nil ->
        {:reply, {:error, %{reason: "Game does not exist"}}, socket}
    end
  end

  def handle_in("end", _payload, socket) do
    "trivia:" <> game_code = socket.topic

    case GameServer.game_pid(game_code) do
      pid when is_pid(pid) ->
        end_game_state = GameServer.game_end(game_code)
        Play.game_save(end_game_state)

        {:noreply, socket}
      nil ->
        {:reply, {:error, %{reason: "Game does not exist"}}, socket}
    end
  end

  def handle_in("scene:next", _payload, socket) do
    "trivia:" <> game_code = socket.topic

    case GameServer.game_pid(game_code) do
      pid when is_pid(pid) ->
        game_state = GameServer.scene_next(game_code)
        broadcast!(socket, "trivia/game_state", game_state)
        {:noreply, socket}
      nil ->
        {:reply, {:error, %{reason: "Game does not exist"}}, socket}
    end
  end

  def handle_in("act:next", _payload, socket) do
    "trivia:" <> game_code = socket.topic

    case GameServer.game_pid(game_code) do
      pid when is_pid(pid) ->
        game_state = GameServer.act_next(game_code)
        broadcast!(socket, "trivia/game_state", game_state)
        {:noreply, socket}
      nil ->
        {:reply, {:error, %{reason: "Game does not exist"}}, socket}
    end
  end

  def handle_in("submit", %{"name" => name, "submission" => submission}, socket) do
    "trivia:" <> game_code = socket.topic

    case GameServer.game_pid(game_code) do
      pid when is_pid(pid) ->
        submission = %{
          id: Ecto.UUID.generate,
          name: name,
          content: submission,
          endorsers: []
        }

        game_state = GameServer.player_submit(game_code, submission)
        broadcast!(socket, "trivia/game_state", game_state)
        {:noreply, socket}
      nil ->
        {:reply, {:error, %{reason: "Game does not exist"}}, socket}
    end
  end

  def handle_in("endorse", %{"name" => name, "submission_id" => submission_id}, socket) do
    "trivia:" <> game_code = socket.topic

    case GameServer.game_pid(game_code) do
      pid when is_pid(pid) ->
        game_state = GameServer.player_endorse(game_code, name, submission_id)

        broadcast!(socket, "trivia/game_state", game_state)
        {:noreply, socket}
      nil ->
        {:reply, {:error, %{reason: "Game does not exist"}}, socket}
    end
  end
end

defmodule Web.TriviaChannel do
  use Web, :channel

  alias Web.Presence
  alias Trivia.GameServer
  alias Database.Play

  def join("trivia:" <> game_code, payload, socket) do
    case GameServer.game_pid(game_code) do
      pid when is_pid(pid) ->
        send(self(), {:after_join, game_code, payload["name"], payload["isHost"]})
        {:ok, assign(socket, :name, payload["name"])}
      nil ->
        {:error, %{reason: "Game does not exist"}}
    end
  end

  def handle_info({:after_join, game_code, name, is_host}, socket) do
    push(socket, "presence_state", Presence.list(socket))

    {:ok, _} = Presence.track(socket, socket.assigns.name, %{
      online_at: inspect(System.system_time(:second))
    })

    game_state =
      case is_host == true do
        true -> GameServer.game_state(game_code)
        false ->
          player = %{ id: Ecto.UUID.generate, name: name, coins: 0 }
          GameServer.player_new(game_code, player)
      end

    broadcast!(socket, "trivia/game_state", game_state)
    {:noreply, socket}
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

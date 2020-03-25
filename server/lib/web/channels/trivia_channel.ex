defmodule Web.TriviaChannel do
  @moduledoc """
  Channel clients join via game code to play trivia game
  """

  use Web, :channel

  alias Web.Presence
  alias Trivia.GameServer
  alias Database.Play

  @doc """
  Join game with game code
  """
  def join("trivia:" <> game_code, payload, socket) do
    case GameServer.game_pid(game_code) do
      pid when is_pid(pid) ->
        send(self(), {:after_join, game_code, payload["name"], payload["isHost"]})
        {:ok, assign(socket, :name, payload["name"])}
      nil ->
        {:error, %{reason: "Game does not exist"}}
    end
  end

  @doc """
  Presence is tracked and initial game state broadcasted
  """
  def handle_info({:after_join, game_code, name, is_host}, socket) do
    push(socket, "presence_state", Presence.list(socket))

    {:ok, _} = Presence.track(socket, socket.assigns.name, %{
      online_at: inspect(System.system_time(:second)),
      name: name,
      isHost: is_host
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

  @doc """
  Triggered from lobby once everyone has joined
  """
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

  @doc """
  Triggered on last scene of game. In future this will take game state
  and store it into database.
  """
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

  @doc """
  Increments scene in game state
  """
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

  @doc """
  Increments act in game state
  """
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

  @doc """
  Player's guess to the question
  """
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

        game_state = GameServer.player_submit(game_code, submission, player_count(socket))
        broadcast!(socket, "trivia/game_state", game_state)
        {:noreply, socket}
      nil ->
        {:reply, {:error, %{reason: "Game does not exist"}}, socket}
    end
  end

  @doc """
  Player's choice out of all submissions for the question
  """
  def handle_in("endorse", %{"name" => name, "submission_id" => submission_id}, socket) do
    "trivia:" <> game_code = socket.topic

    case GameServer.game_pid(game_code) do
      pid when is_pid(pid) ->
        game_state = GameServer.player_endorse(game_code, name, submission_id, player_count(socket))

        broadcast!(socket, "trivia/game_state", game_state)
        {:noreply, socket}
      nil ->
        {:reply, {:error, %{reason: "Game does not exist"}}, socket}
    end
  end

  @doc """
  List of actively connected players used to determine if everyone is
  done submitting or endorsing
  """
  def player_count(socket) do
    Presence.list(socket)
      |> Map.keys
      |> Enum.count
  end
end

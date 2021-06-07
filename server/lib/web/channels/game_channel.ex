defmodule Web.GameChannel do
  @moduledoc """
  Channel clients join via game code to play game game
  """

  use Web, :channel

  alias Web.Presence
  alias Game.GameServer

  @doc """
  Join game with game code
  """
  def join("game:" <> game_code, payload, socket) do
    case GameServer.game_pid(game_code) do
      pid when is_pid(pid) ->
        send(self(), {:after_join, game_code, payload["name"], payload["isSpectator"]})
        {:ok, assign(socket, :name, payload["name"])}

      nil ->
        {:error, %{reason: "Game does not exist"}}
    end
  end

  @doc """
  Presence is tracked and initial game state broadcasted
  """
  def handle_info({:after_join, game_code, name, is_spectator}, socket) do
    push(socket, "presence_state", Presence.list(socket))

    {:ok, _} =
      Presence.track(socket, socket.assigns.name, %{
        name: name,
        isSpectator: is_spectator,
        prevScore: 0,
        score: 0
      })

    case is_spectator == true do
      true ->
        GameServer.game_state(game_code)

      false ->
        GameServer.player_new(game_code, name)
    end
    |> game_state_broadcast(socket)

    {:noreply, socket}
  end

  @doc """
  Triggered from lobby once everyone has joined
  """
  def handle_in("start", _payload, socket) do
    "game:" <> game_code = socket.topic

    case GameServer.game_pid(game_code) do
      pid when is_pid(pid) ->
        GameServer.game_start(game_code)
        |> game_state_broadcast(socket)

        {:noreply, socket}

      nil ->
        {:reply, {:error, %{reason: "Game does not exist"}}, socket}
    end
  end

  @doc """
  Increments step in game state
  """
  def handle_in("step:next", _payload, socket) do
    "game:" <> game_code = socket.topic

    case GameServer.game_pid(game_code) do
      pid when is_pid(pid) ->
        GameServer.step_next(game_code)
        |> game_state_broadcast(socket)

        {:noreply, socket}

      nil ->
        {:reply, {:error, %{reason: "Game does not exist"}}, socket}
    end
  end

  @doc """
  Increments scene in game state
  """
  def handle_in("scene:next", _payload, socket) do
    "game:" <> game_code = socket.topic

    case GameServer.game_pid(game_code) do
      pid when is_pid(pid) ->
        GameServer.scene_next(game_code)
        |> game_state_broadcast(socket)

        {:noreply, socket}

      nil ->
        {:reply, {:error, %{reason: "Game does not exist"}}, socket}
    end
  end

  @doc """
  Player's guess to the question
  """
  def handle_in("submit", %{"name" => name, "submission" => submission}, socket) do
    "game:" <> game_code = socket.topic

    case GameServer.game_pid(game_code) do
      pid when is_pid(pid) ->
        GameServer.player_submit(game_code, name, submission, player_count(socket))
        |> player_score_update(socket, name)
        |> game_state_broadcast(socket)

        {:noreply, socket}

      nil ->
        {:reply, {:error, %{reason: "Game does not exist"}}, socket}
    end
  end

  @doc """
  Send message to players in a game to join new game
  """
  def handle_in("invite", %{"game_code" => game_code, "new_code" => new_code}, socket) do
    case GameServer.game_pid(game_code) do
      pid when is_pid(pid) ->
        # this should broadcast to the game:game_code topic
        Web.Endpoint.broadcast_from!(self(), "game:#{game_code}", "game/invite", %{
          gameId: new_code
        })

        {:noreply, socket}

      nil ->
        {:reply, {:error, %{reason: "Game does not exist"}}, socket}
    end
  end

  @doc """
  List of actively connected players to determine if everyone is done
  """
  defp player_count(socket) do
    Presence.list(socket)
    |> Map.values()
    |> Enum.filter(&(Enum.at(&1.metas, 0).isSpectator === false))
    |> Enum.count()
  end

  # Update player's score based on game state
  defp player_score_update(game_state, socket, name) do
    game_state_player =
      Enum.filter(game_state.players, fn x -> x.name === name end)
      |> Enum.at(0)

    score = game_state_player |> Map.get(:score)
    prev_score = game_state_player |> Map.get(:prev_score)

    player =
      Presence.list(socket)
      |> Map.get(name)
      |> Map.get(:metas)
      |> Enum.at(0)

    Presence.update(
      socket,
      name,
      %{player | prevScore: prev_score, score: score}
    )

    game_state
  end

  @doc """
  Removes players array from game state since it's returned in presence
  """
  defp game_state_format(game_state) do
    Map.delete(game_state, :players)
  end

  @doc """
  Formats and broadcasts game state to connected clients
  """
  defp game_state_broadcast(game_state, socket) do
    broadcast!(socket, "game/game_state", game_state |> game_state_format())
  end
end

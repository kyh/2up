defmodule Game.GameSupervisor do
  use DynamicSupervisor

  alias Game.GameServer

  def start_link(_arg) do
    DynamicSupervisor.start_link(__MODULE__, :ok, name: __MODULE__)
  end

  def init(:ok) do
    DynamicSupervisor.init(strategy: :one_for_one)
  end

  def start_game(game_code, questions) do
    child_spec = %{
      id: GameServer,
      start: {GameServer, :start_link, [game_code, questions]},
      restart: :transient
    }

    DynamicSupervisor.start_child(__MODULE__, child_spec)
  end

  def stop_game(game_code) do
    :ets.delete(:games_table, game_code)

    child_pid = GameServer.game_pid(game_code)
    DynamicSupervisor.terminate_child(__MODULE__, child_pid)
  end
end

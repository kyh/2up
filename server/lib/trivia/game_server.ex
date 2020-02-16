defmodule Trivia.GameServer do

  use GenServer

  require Logger

  @timeout :timer.hours(3)

  def start_link(game_code, questions) do
    GenServer.start_link(__MODULE__, 
                         {game_code, questions}, 
                         name: via_tuple(game_code))
  end

  def state(game_code) do
    GenServer.call(via_tuple(game_code), :state)
  end

  def game_pid(game_code) do
    game_code
    |> via_tuple
    |> GenServer.whereis
  end

  def via_tuple(game_code) do
    {:via, Registry, {Trivia.GameRegistry, game_code}}
  end

  def init({game_code, questions}) do
    game = case :ets.lookup(:games_table, game_code) do
      [] ->
        game = Trivia.Game.new(questions, [])
        :ets.insert(:games_table, {game_code, game})
        game

      [{^game_code, game}] ->
        game
    end

    Logger.info("Spawned game server process named '#{game_code}'.")

    {:ok, game, @timeout}
  end

  def handle_call(:state, _from, game) do
    game_state = %{
      gameID: game.code,
      act: game.act,
      scene: game.scene
    }

    {:reply, get_state(game), game, @timeout}
  end
end

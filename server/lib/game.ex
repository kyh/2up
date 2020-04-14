defmodule Game do
  use Application

  def start(_type, _args) do
    children = [
      {Registry, keys: :unique, name: Game.GameRegistry},
      Game.GameSupervisor
    ]

    :ets.new(:games_table, [:public, :named_table])

    opts = [strategy: :one_for_one, name: Game.Supervisor]
    Supervisor.start_link(children, opts)
  end

  def child_spec(_opts) do
    %{
      id: __MODULE__,
      start: {__MODULE__, :start, [nil, nil]},
      restart: :permanent
    }
  end
end

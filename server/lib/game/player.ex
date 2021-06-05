defmodule Game.Player do
  @moduledoc """
  Player that has connected to the game
  """

  @derive Jason.Encoder
  defstruct name: "", score: 0, prev_score: 0
end

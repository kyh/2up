defmodule Game.Player do
  @derive Jason.Encoder
  defstruct name: "", score: 0, prev_score: 0
end

defmodule Game.Player do	
  defstruct id: 0, score: 0	

  alias Game.{Player}	

  def new(id, score) do	
    %Player{id: id, score: score}	
  end	
end

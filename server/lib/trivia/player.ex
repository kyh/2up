defmodule Trivia.Player do	
  defstruct id: 0, coins: 0	

  alias Trivia.{Player}	

  def new(id, coins) do	
    %Player{id: id, coins: coins}	
  end	
end

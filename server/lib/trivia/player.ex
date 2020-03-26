defmodule Trivia.Player do	
  defstruct id: 0, score: 0	

  alias Trivia.{Player}	

  def new(id, score) do	
    %Player{id: id, score: score}	
  end	
end

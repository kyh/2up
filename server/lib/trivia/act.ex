defmodule Trivia.Act do	
  defstruct question: '', answer: '', submissions: [], endorsements: []	

  alias Trivia.{Act}	

  def new(question, answer, submissions, endorsements) do	
    %Act{	
      question: question,	
      answer: answer,	
      submissions: submissions,	
      endorsements: endorsements	
    }	
  end	
end

defmodule Trivia.Act do	
  @moduledoc """
  Act is one full life cycle of a question
  Submission -> Endorsement -> Results
  """

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

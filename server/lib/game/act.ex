defmodule Game.Act do
  @moduledoc """
  Act is one full life cycle of a question
  Submission -> Endorsement -> Results
  """

  defstruct question: '',
    answer: '',
    pack: '',
    instruction: '',
    submissions: [],
    endorsements: []

  alias Game.{Act}

  def new(question, answer, pack, instruction, submissions, endorsements) do
    %Act{
      question: question,
      answer: answer,
      pack: pack,
      instruction: instruction,
      submissions: submissions,
      endorsements: endorsements
    }
  end
end

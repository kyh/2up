defmodule Game.Act do
  @moduledoc """
  Act is one full life cycle of a question
  Submission -> Endorsement -> Results
  """

  defstruct question: '',
            question_type: '',
            answer: '',
            answer_type: '',
            pack: '',
            instruction: '',
            submissions: [],
            endorsements: []
end

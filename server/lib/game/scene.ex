defmodule Game.Scene do
  @moduledoc """
  Scene is one full life cycle of a question
  Submission -> Endorsement -> Results
  """

  @derive Jason.Encoder
  defstruct question: '',
            question_type: '',
            answer: '',
            answer_type: '',
            pack: '',
            instruction: '',
            submissions: []
end

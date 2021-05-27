defmodule Game.Scene do
  @moduledoc """
  Scene is one full life cycle of a question
  """

  @derive Jason.Encoder
  defstruct question: '',
            question_type: '',
            answer_type: '',
            pack: '',
            instruction: '',
            submissions: [],
            scene_answers: []

  def new(question_set) do
    %Game.Scene{
      question: question_set.question,
      question_type: question_set.question_type,
      scene_answers: question_set.scene_answers,
      answer_type: question_set.answer_type,
      pack: question_set.pack,
      instruction: question_set.instruction,
      submissions: []
    }
  end
end

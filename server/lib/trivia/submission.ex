defmodule Trivia.Submission do
  defstruct content: '', player_id: 0

  alias Trivia.{Submission}

  def new(content, player_id) do
    %Submission{content: content, player_id: player_id}
  end
end

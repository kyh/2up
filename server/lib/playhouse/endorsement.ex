defmodule Playhouse.Endorsement do
  use Ecto.Schema
  import Ecto.Changeset

  schema "endorsements" do
    belongs_to :submission, Playhouse.Submission
    belongs_to :answer, Playhouse.Answer

    timestamps()
  end

  def changeset(endorsement, attrs) do
    endorsement
    |> cast(attrs, [])
  end
end

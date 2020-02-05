defmodule Playhouse.Play.Endorsement do
  use Ecto.Schema
  import Ecto.Changeset

  schema "endorsements" do
    belongs_to :submission, Playhouse.Play.Submission
    belongs_to :answer, Playhouse.Catalog.Answer
    belongs_to :player, Playhouse.Play.Player

    timestamps()
  end

  def changeset(endorsement, attrs) do
    endorsement
    |> cast(attrs, [])
  end
end

defmodule Database.Play.Endorsement do
  use Ecto.Schema
  import Ecto.Changeset

  schema "endorsements" do
    belongs_to :submission, Database.Play.Submission
    belongs_to :answer, Database.Catalog.Answer
    belongs_to :player, Database.Play.Player

    timestamps()
  end

  def changeset(endorsement, attrs) do
    endorsement
    |> cast(attrs, [])
  end
end

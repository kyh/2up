defmodule Playhouse.Play.Endorsement do
  use Ecto.Schema
  import Ecto.Changeset

  schema "endorsements" do
    belongs_to :submission, Playhouse.Play.Submission
    belongs_to :answer, Playhouse.Catalog.Answer

    timestamps()
  end

  def changeset(endorsement, attrs) do
    endorsement
    |> cast(attrs, [])
  end
end

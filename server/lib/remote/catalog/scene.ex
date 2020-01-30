defmodule Remote.Catalog.Scene do
  use Ecto.Schema
  import Ecto.Changeset

  schema "scenes" do
    field :prompt, :string

    belongs_to :user, Remote.Accounts.User
    belongs_to :play, Remote.Catalog.Play
    has_many :responses, Remote.Catalog.Response

    timestamps()
  end

  def changeset(scene, attrs) do
    required_fields = [:prompt]
    
    scene
    |> cast(attrs, required_fields)
    |> validate_required(required_fields)
    |> assoc_constraint(:user)
    |> assoc_constraint(:play)
  end
end

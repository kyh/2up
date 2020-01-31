defmodule Playhouse.Catalog.Play do
  use Ecto.Schema
  import Ecto.Changeset

  schema "plays" do
    field :name, :string

    belongs_to :user, Playhouse.Accounts.User
    has_many :scenes, Playhouse.Catalog.Scene

    timestamps()
  end

  def changeset(play, attrs) do
    required_fields = [:name]
    
    play
    |> cast(attrs, required_fields)
    |> validate_required(required_fields)
    |> assoc_constraint(:user)
  end
end

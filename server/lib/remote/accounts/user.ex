defmodule Remote.Accounts.User do
  use Ecto.Schema
  import Ecto.Changeset

  schema "users" do
    field :username, :string
    field :email, :string
    field :password_hash, :string
    field :password, :string, virtual: true

    has_many :plays, Remote.Catalog.Play
    has_many :scenes, Remote.Catalog.Scene
    has_many :responses, Remote.Catalog.Response

    timestamps()
  end

  def changeset(user, attrs) do
    required_fields = [:username, :email, :password_hash]
    
    user
    |> cast(attrs, required_fields)
    |> validate_required(required_fields)
  end
end

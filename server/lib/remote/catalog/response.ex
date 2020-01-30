defmodule Remote.Catalog.Response do
  use Ecto.Schema
  import Ecto.Changeset

  schema "responses" do
    field :response, :string
    field :correct, :boolean, default: false

    belongs_to :user, Remote.Accounts.User
    belongs_to :scene, Remote.Catalog.Scene

    timestamps()
  end

  def changeset(response, attrs) do
    required_fields = [:response, :correct]
    
    response
    |> cast(attrs, required_fields)
    |> validate_required(required_fields)
    |> assoc_constraint(:user)
    |> assoc_constraint(:scene)
  end
end

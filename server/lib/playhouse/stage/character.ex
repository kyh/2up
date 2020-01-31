defmodule Playhouse.Stage.Character do
  use Ecto.Schema
  import Ecto.Changeset

  schema "characters" do
    field :name, :string

    belongs_to :user, Playhouse.Accounts.User
    belongs_to :production, Playhouse.Stage.Production

    timestamps()
  end

  def changeset(response, attrs) do
    required_fields = [:name]
    
    response
    |> cast(attrs, required_fields)
    |> validate_required(required_fields)
    |> assoc_constraint(:production)
  end
end

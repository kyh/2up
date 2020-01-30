defmodule Remote.Stage.Character do
  use Ecto.Schema
  import Ecto.Changeset

  schema "characters" do
    field :name, :string

    belongs_to :user, Remote.Accounts.User
    belongs_to :production, Remote.Stage.Production

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

defmodule Database.Catalog.Play do
  use Ecto.Schema
  import Ecto.Changeset

  schema "plays" do
    belongs_to :user, Database.Accounts.User
    many_to_many :acts, Database.Catalog.Act,
      join_through: Database.Catalog.PlayAct

    field :name, :string
    field :instruction, :string

    timestamps()
  end

  def changeset(question, attrs) do
    required_fields = [:name, :instruction]

    question
    |> cast(attrs, required_fields)
    |> validate_required(required_fields)
    |> assoc_constraint(:user)	
  end
end

defmodule Database.Catalog.Act do
  use Database.Schema
  import Ecto.Changeset

  @endorsement_types %{
    text: 0,
    color: 1,
    drawing: 2
  }

  schema "acts" do
    belongs_to :user, Database.Accounts.User
    many_to_many :questions, Database.Catalog.Question,
      join_through: Database.Catalog.ActQuestion

    field :endorsement_type, :integer

    timestamps()
  end

  def changeset(question, attrs) do
    required_fields = [:content]

    question
    |> cast(attrs, required_fields)
    |> validate_required(required_fields)
    |> assoc_constraint(:user)	
    |> assoc_constraint(:pack)	
  end
end

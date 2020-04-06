defmodule Database.Catalog.ActQuestion do
  use Database.Model

  schema "act_questions" do
    belongs_to :act, Database.Catalog.Act
    belongs_to :question, Database.Catalog.Question

    timestamps()
  end

  def changeset(question, attrs) do
    question
    |> cast(attrs, [])
    |> assoc_constraint(:act)	
    |> assoc_constraint(:question)	
  end
end

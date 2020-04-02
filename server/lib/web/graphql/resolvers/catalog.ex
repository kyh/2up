defmodule Web.GraphQL.Resolvers.Catalog do
  alias Database.Catalog

  def questions(_, _, _) do
    {:ok, Catalog.list_questions()}
  end

  def question_types(_, _, _) do
    {:ok, ["TEXT", "COLOR", "MAP", "BUTTON", "MATH"]}
  end

  def answer_types(_, _, _) do
    {:ok, ["TEXT", "COLOR", "MAP", "BUTTON", "MATH"]}
  end

  def packs(_, _, _) do
    {:ok, ["Startups", "SAT", "Variety"]}
  end
end

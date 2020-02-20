defmodule Web.GraphQL.Resolvers.Catalog do
  alias Database.Catalog

  def questions(_, _, _) do
    {:ok, Catalog.list_questions()}
  end
end

defmodule Playhouse.Catalog do	
  import Ecto.Query

  alias Playhouse.Repo
  alias Playhouse.Catalog.Question

  def random_question do
    query =
      from Question,
      order_by: fragment("RANDOM()"),
      limit: 1

    Repo.one(query)
  end
end

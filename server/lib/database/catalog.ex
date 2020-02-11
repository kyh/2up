defmodule Database.Catalog do	
  import Ecto.Query

  alias Database.Repo
  alias Database.Catalog.Question

  def random_question do
    query =
      from Question,
      order_by: fragment("RANDOM()"),
      limit: 1

    Repo.one(query)
  end

  def generate_code do
    uuid = Ecto.UUID.generate
    four_char = String.slice(uuid, 0, 4)
    String.upcase(four_char)
  end
end

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
    :io_lib.format("~4..0B", [:rand.uniform(10_000) - 1])
    |> List.to_string
  end

  def random_formatted_questions(size) do
    query =
      from Question,
      order_by: fragment("RANDOM()"),
      limit: ^size

    Repo.all(query)
    |> Enum.map(fn x -> 
      [x.content, x.answer]
    end)
  end

  def list_questions() do
    Repo.all(Question)	
  end
end

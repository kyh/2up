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

  def random_formatted_questions(size) do
    query =
      from Question,
      preload: [:answer],
      order_by: fragment("RANDOM()"),
      limit: ^size

    Repo.all(query)
    |> Enum.map(fn x -> 
      [x.content, x.answer.content]
    end)
  end
end

defmodule Remote.Accounts do
  import Ecto.Adapters.SQL

  def get_user(id) do
    sql = """
      SELECT * FROM users
      WHERE users.id = $1
    """

    query(Remote.Repo, sql, [id])
  end
end

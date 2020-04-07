defmodule Web.GraphQL.Plugs.SetCurrentUser do
  @behaviour Plug

  import Plug.Conn

  def init(opts), do: opts

  def call(conn, _) do
    context = build_context(conn)
    Absinthe.Plug.put_options(conn, context: context)
  end

  defp build_context(conn) do
    with ["Bearer " <> token] <- get_req_header(conn, "Authorization"),
         {:ok, %{id: id}} <- Web.Token.verify(token),
         %{} = user <- Database.Accounts.get_user(id) do
      %{current_user: user}
    else
      _ -> %{}
    end
  end
end

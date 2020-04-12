defmodule Web.GraphQL.Resolvers.Catalog do
  alias Database.Catalog
  alias Web.GraphQL.Errors
  alias Absinthe.Relay.Connection

  def pack_list(_, args, _) do 
    Connection.from_list(Catalog.pack_list(), args)
  end

  def pack_create(_, args, %{context: %{current_user: user}}) do
    case Catalog.pack_create(user, args) do
      {:error, changeset} ->
        {
          :error,
          message: "Pack creation failed",
          details: Errors.error_details(changeset)
        }

      {:ok, pack} ->
        {:ok, %{pack: pack}}
    end
  end

  def act_create(_, args, %{context: %{current_user: user}}) do
    case Catalog.act_create(user, args) do
      {:error, changeset} ->
        {
          :error,
          message: "Act creation failed",
          details: Errors.error_details(changeset)
        }

      {:ok, act} ->
        {:ok, %{act: act}}
    end
  end
end

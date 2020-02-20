defmodule Web.GraphQL.Resolvers.Accounts do
  alias Database.Accounts

  alias Web.GraphQL.Errors

  def signin(_, %{username: username, password: password}, _) do
    case Accounts.authenticate(username, password) do
      :error ->
        {:error, "Invalid username/password combination"}

      {:ok, user} ->
        token = Web.Token.sign(user)
        {:ok, %{user: user, token: token}}
    end
  end

  def signup(_, args, _) do
    case Accounts.create_user(args) do
      {:error, changeset} ->
        {
          :error,
          message: "Signup failed",
          details: Errors.error_details(changeset)
        }

      {:ok, user} ->
        token = Web.Token.sign(user)
        {:ok, %{user: user, token: token}}
    end
  end
end

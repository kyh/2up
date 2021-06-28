defmodule Web.GraphQL.Resolvers.Accounts do
  alias Database.Accounts

  alias Web.GraphQL.Errors

  def session_create(_, %{username: username, password: password}, _) do
    case Accounts.session_create(username, password) do
      :error ->
        {:error, "Invalid username/password combination"}

      {:ok, user} ->
        token = Web.Token.sign(user)
        {:ok, %{user: user, token: token}}
    end
  end

  def user_create(_, args, _) do
    case Accounts.user_create(args) do
      {:error, changeset} ->
        {
          :error,
          message: "Signup failed", details: Errors.error_details(changeset)
        }

      {:ok, user} ->
        token = Web.Token.sign(user)
        {:ok, %{user: user, token: token}}
    end
  end

  def user_update(_, args, %{context: %{current_user: user}}) do
    case Accounts.user_update(args, user) do
      {:error, changeset} ->
        {
          :error,
          message: "User update failed", details: Errors.error_details(changeset)
        }

      {:ok, user} ->
        {:ok, %{user: user}}
    end
  end

  def current_user(_, _args, %{context: %{current_user: user}}) do
    {:ok, user}
  end

  def current_user(_, _args, _) do
    {:ok, nil}
  end
end

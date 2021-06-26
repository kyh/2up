defmodule Database.Accounts do
  use Database.Context

  def user_get(id) do
    Repo.get(User, id)
  end

  def user_create(attrs) do
    %User{}
    |> User.changeset(attrs)
    |> Repo.insert()
  end

  def user_update(
        %User{} = current_user,
        attrs
      ) do
    user = Repo.get_by(User, id: attrs.id)

    with {:ok} <- Authorization.check(:user_update, current_user, user) do
      user
      |> User.changeset(attrs)
      |> Repo.update()
    end
  end

  def session_create(identifier, password) do
    user_get_by_identifier(identifier)
    |> password_check(password)
  end

  defp user_get_by_identifier(identifier) do
    case is_email(identifier) do
      true ->
        Repo.get_by(User, email: identifier)

      false ->
        Repo.get_by(User, username: identifier)
    end
  end

  defp password_check(user, password) do
    with %{password_hash: password_hash} <- user,
         true <- Pbkdf2.verify_pass(password, password_hash) do
      {:ok, user}
    else
      _ -> :error
    end
  end

  defp is_email(identifier) do
    String.contains?(identifier, "@")
  end
end

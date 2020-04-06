defmodule Database.Accounts.User do
  use Ecto.Schema
  import Ecto.Changeset

  schema "users" do
    has_many :plays, Database.Catalog.Play
    has_many :acts, Database.Catalog.Act

    field :username, :string
    field :email, :string
    field :password_hash, :string
    field :password, :string, virtual: true

    timestamps()
  end

  def changeset(user, attrs) do
    required_fields = [:username, :email, :password]
    
    user
    |> cast(attrs, required_fields)
    |> validate_required(required_fields)
    |> validate_length(:password, min: 6)
    |> unique_constraint(:username)
    |> unique_constraint(:email)
    |> hash_password()
  end

  defp hash_password(changeset) do
    case changeset do
      %Ecto.Changeset{valid?: true, changes: %{password: password}} ->
        put_change(changeset, :password_hash, Pbkdf2.hash_pwd_salt(password))
      _ ->
        changeset
    end
  end
end

defmodule Database.Model do
  defmacro __using__(_) do
    quote do
      use Ecto.Schema

      import Ecto
      import Ecto.Changeset
      import Ecto.Query

      alias Database.Accounts.User
      alias Database.Catalog.ActQuestion
      alias Database.Catalog.Act
      alias Database.Catalog.Answer
      alias Database.Catalog.Pack
      alias Database.Catalog.PlayAct
      alias Database.Catalog.Play
      alias Database.Catalog.Question
    end
  end
end

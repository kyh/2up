defmodule Database.Context do
  defmacro __using__(_) do
    quote do
      import Ecto
      import Ecto.Changeset
      import Ecto.Query

      alias Database.Repo

      alias Database.Accounts.User

      alias Database.Catalog.{
        Scene,
        SceneAnswer,
        AnswerType,
        QuestionType
      }

      alias Database.Live.{
        Tag,
        PackTag,
        Pack,
        Tag,
        Play,
        PackAsset
      }
    end
  end
end

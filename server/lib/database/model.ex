defmodule Database.Model do
  defmacro __using__(_) do
    quote do
      use Ecto.Schema

      import Ecto
      import Ecto.Changeset
      import Ecto.Query

      alias Database.Accounts.User

      alias Database.Catalog.{
        Scene,
        SceneAnswer,
        AnswerType,
        QuestionType
      }

      alias Database.Live.{
        Tag,
        PackScene,
        PackTag,
        Pack,
        Tag,
        Play
      }
    end
  end
end

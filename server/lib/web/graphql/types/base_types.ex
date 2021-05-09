defmodule Web.GraphQL.Types.BaseTypes do
  use Absinthe.Schema.Notation
  use Absinthe.Relay.Schema.Notation, :modern

  alias Database.Catalog.{Scene, QuestionType, AnswerType}
  alias Database.Live.Pack
  alias Database.Accounts.User

  node interface do
    resolve_type(fn
      %Pack{}, _ ->
        :pack

      %Scene{}, _ ->
        :scene

      %QuestionType{}, _ ->
        :question_type

      %AnswerType{}, _ ->
        :answer_type

      %User{}, _ ->
        :user
    end)
  end
end

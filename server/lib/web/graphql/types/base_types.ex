defmodule Web.GraphQL.Types.BaseTypes do
  use Absinthe.Schema.Notation
  use Absinthe.Relay.Schema.Notation, :modern

  node interface do
    resolve_type(fn
      %Database.Live.Pack{}, _ ->
        :pack

      %Database.Catalog.Act{}, _ ->
        :act

      %Database.Catalog.QuestionType{}, _ ->
        :question_type

      %Database.Catalog.AnswerType{}, _ ->
        :answer_type

      %Database.Accounts.User{}, _ ->
        :user
    end)
  end
end

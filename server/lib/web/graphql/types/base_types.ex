defmodule Web.GraphQL.Types.BaseTypes do
  use Absinthe.Schema.Notation
  use Absinthe.Relay.Schema.Notation, :modern

  alias Database.Catalog.{Scene, SceneAnswer, QuestionType, AnswerType}
  alias Database.Live.{Pack, PackAsset}
  alias Database.Accounts.User

  node interface do
    resolve_type(fn
      %Pack{}, _ ->
        :pack

      %PackAsset{}, _ ->
        :pack_asset

      %Scene{}, _ ->
        :scene

      %SceneAnswer{}, _ ->
        :scene_answer

      %QuestionType{}, _ ->
        :question_type

      %AnswerType{}, _ ->
        :answer_type

      %User{}, _ ->
        :user
    end)
  end
end

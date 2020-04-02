defmodule Web.GraphQL.Schema do
  @moduledoc """
  Currently only `game_new` and `game` mutations are used

  In process of building out schema to allow users to
  create and share their own collections of questions
  """

  use Absinthe.Schema
  alias Web.GraphQL.Resolvers.{Catalog, Accounts, Play}

  query do
    @desc "Get a list of questions"
    field :questions, list_of(:question) do
      resolve &Catalog.questions/3
    end

    field :question_types, list_of(:string) do
      resolve &Catalog.question_types/3
    end

    field :answer_types, list_of(:string) do
      resolve &Catalog.answer_types/3
    end

    field :packs, list_of(:string) do
      resolve &Catalog.packs/3
    end
  end

  mutation do
    @desc "Create user"
    field :signup, :session do
      arg :username, non_null(:string)
      arg :email, non_null(:string)
      arg :password, non_null(:string)
      resolve &Accounts.signup/3
    end

    @desc "Sign in user"
    field :signin, :session do
      arg :username, non_null(:string)
      arg :password, non_null(:string)
      resolve &Accounts.signin/3
    end

    @desc "Create new live game"
    field :game_new, :code do
      arg :pack, non_null(:string)
      resolve &Play.game_new/3
    end

    @desc "Get info about live game"
    field :game, :game do
      arg :code, non_null(:string)
      resolve &Play.game_validate/3
    end
  end

  object :question do
    field :id, non_null(:id)
    field :content, non_null(:string)
  end

  object :user do
    field :username, non_null(:string)
    field :email, non_null(:string)
  end

  object :session do
    field :user, non_null(:user)
    field :token, non_null(:string)
  end

  object :code do
    field :code, non_null(:string)
  end

  object :game do
    field :is_valid, non_null(:boolean)
  end
end

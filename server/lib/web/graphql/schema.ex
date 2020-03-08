defmodule Web.GraphQL.Schema do
  use Absinthe.Schema
  alias Web.GraphQL.Resolvers.{Catalog, Accounts, Live}

  query do
    @desc "Get a list of questions"
    field :questions, list_of(:question) do
      resolve &Catalog.questions/3
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
    field :trivia_new, :code do
      resolve &Live.trivia_new/3
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
end

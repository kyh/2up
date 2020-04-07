defmodule Web.GraphQL.Schema do
  @moduledoc """
  Currently only `game_new` and `game` mutations are used

  In process of building out schema to allow users to
  create and share their own collections of questions
  """

  use Absinthe.Schema
  use Absinthe.Relay.Schema, :modern
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
    payload field :user_create do
      input do
        field :username, non_null(:string)
        field :email, non_null(:string)
        field :password, non_null(:string)
      end

      output do
        field :user, non_null(:user)
        field :token, non_null(:string)
      end

      resolve &Accounts.signup/3
    end

    @desc "Sign in user"
    payload field :session_create do
      input do
        field :username, non_null(:string)
        field :password, non_null(:string)
      end

      output do
        field :user, non_null(:user)
        field :token, non_null(:string)
      end

      resolve &Accounts.signin/3
    end

    @desc "Create new live game"
    payload field :game_create do
      input do
        field :pack, non_null(:string)
      end

      output do
        field :code, non_null(:string)
      end

      resolve &Play.game_create/3
    end

    @desc "Get info about live game"
    payload field :game do
      input do
        field :code, non_null(:string)
      end

      output do
        field :is_valid, non_null(:boolean)
      end

      resolve &Play.game_validate/3
    end

    @desc "Create new pack"
    payload field :pack_create do
      input do
        field :name, non_null(:string)
      end

      output do
        field :pack, non_null(:pack)
      end

      resolve &Catalog.pack_create/3
    end
  end

  node interface do
    resolve_type fn
      %Database.Catalog.Pack{}, _ ->
        :pack
    end
  end

  node object :pack do
    field :name, non_null(:string)
    field :user, :user
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

defmodule Web.GraphQL.Types.MutationType do
  use Absinthe.Schema.Notation
  use Absinthe.Relay.Schema.Notation, :modern

  alias Web.GraphQL.Resolvers.{
    Catalog,
    Accounts,
    Live
  }

  object :mutation_type do
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

      resolve(&Accounts.user_create/3)
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

      resolve(&Accounts.session_create/3)
    end

    @desc "Create new live game"
    payload field :game_create do
      input do
        field :pack, non_null(:string)
      end

      output do
        field :code, non_null(:string)
      end

      resolve(&Live.game_create/3)
    end

    @desc "Get info about live game"
    payload field :game do
      input do
        field :code, non_null(:string)
      end

      output do
        field :is_valid, non_null(:boolean)
      end

      resolve(&Live.game_validate/3)
    end

    @desc "Create new pack"
    payload field :pack_create do
      input do
        field :name, non_null(:string)
      end

      output do
        field :pack, non_null(:pack)
      end

      resolve(&Live.pack_create/3)
    end

    @desc "Create new act"
    payload field :act_create do
      input do
        field :pack_id, :id
        field :order, :integer
        field :question_type_id, :id
        field :answer_type_id, :id
        field :question, :string
        field :answer, :string
        field :instruction, :string
      end

      output do
        field :act, non_null(:act)
      end

      resolve(
        parsing_node_ids(&Catalog.act_create/2,
          pack_id: :pack,
          question_type_id: :question_type,
          answer_type_id: :answer_type
        )
      )
    end

    @desc "Update act"
    payload field :act_update do
      input do
        field :id, :id
        field :order, :integer
        field :question_type_id, :id
        field :answer_type_id, :id
        field :question, :string
        field :answer, :string
        field :instruction, :string
      end

      output do
        field :act, non_null(:act)
      end

      resolve(
        parsing_node_ids(&Catalog.act_update/2,
          id: :act,
          question_type_id: :question_type,
          answer_type_id: :answer_type
        )
      )
    end
  end
end

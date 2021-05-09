defmodule Web.GraphQL.Types.MutationType do
  use Absinthe.Schema.Notation
  use Absinthe.Relay.Schema.Notation, :modern

  alias Absinthe.Relay.Connection

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
        field :pack_id, non_null(:id)
      end

      output do
        field :code, non_null(:string)
      end

      resolve(parsing_node_ids(&Live.game_create/2, pack_id: :pack))
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
        field :description, non_null(:string)
        field :is_random, non_null(:boolean)
        field :length, non_null(:integer)
      end

      output do
        field :pack, non_null(:pack)
      end

      resolve(&Live.pack_create/3)
    end

    @desc "Update pack"
    payload field :pack_update do
      input do
        field :id, :id
        field :name, :string
        field :is_random, :boolean
        field :length, :integer
      end

      output do
        field :pack, non_null(:pack)
      end

      resolve(parsing_node_ids(&Live.pack_update/2, id: :pack))
    end

    @desc "Create new scene and pack scene"
    payload field :scene_create do
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
        field :scene, non_null(:scene)
      end

      resolve(
        parsing_node_ids(&Catalog.scene_create/2,
          pack_id: :pack,
          question_type_id: :question_type,
          answer_type_id: :answer_type
        )
      )
    end

    @desc "Update scene"
    payload field :scene_update do
      input do
        field :id, :id
        field :order, :integer
        field :question_type_slug, :string
        field :answer_type_slug, :string
        field :question, :string
        field :answer, :string
        field :instruction, :string
      end

      output do
        field :scene, non_null(:scene)
      end

      resolve(parsing_node_ids(&Catalog.scene_update/2, id: :scene))
    end

    @desc "Delete pack scene and scene (if no dependencies)"
    payload field :scene_delete do
      input do
        field :pack_id, :id
        field :id, :id
      end

      output do
        field :scene, non_null(:scene)
      end

      resolve(
        parsing_node_ids(&Catalog.scene_delete/2,
          id: :scene,
          pack_id: :pack
        )
      )
    end

    @desc "Update pack scene"
    payload field(:pack_scene_update) do
      input do
        field :id, :id
        field :pack_id, :id
        field :before_id, :id
        field :after_id, :id
      end

      output do
        field :pack_scene, non_null(:pack_scene)
      end

      resolve(
        parsing_node_ids(&Catalog.pack_scene_update/2,
          id: :scene,
          pack_id: :pack,
          before_id: :scene,
          after_id: :scene
        )
      )
    end
  end
end

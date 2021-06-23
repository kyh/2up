defmodule Web.GraphQL.Types.QueryType do
  use Absinthe.Schema.Notation
  use Absinthe.Relay.Schema.Notation, :modern
  alias Web.GraphQL.Resolvers.{
    Accounts,
    Catalog,
    Live,
    AssetLibrary
  }

  object :query_type do
    connection field :packs, node_type: :pack do
      arg(:username, :string)
      resolve(&Live.pack_list/3)
    end

    field :current_user, :user do
      resolve(&Accounts.current_user/3)
    end

    field :pack, :pack do
      arg(:id, non_null(:id))
      resolve(parsing_node_ids(&Live.pack_get_by_id/2, id: :pack))
    end

    field :scene, :scene do
      arg(:id, :id)
      arg(:pack_id, :id)
      resolve(parsing_node_ids(&Catalog.scene_get_by_id/2, id: :scene, pack_id: :pack))
    end

    field :question_types, list_of(:question_type) do
      resolve(&Catalog.question_type_list/3)
    end

    field :answer_types, list_of(:answer_type) do
      resolve(&Catalog.answer_type_list/3)
    end
    
    field :assets, list_of(:asset) do
      arg(:path, :string)
      resolve(&AssetLibrary.list/3)
    end
  end
end

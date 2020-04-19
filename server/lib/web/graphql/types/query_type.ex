defmodule Web.GraphQL.Types.QueryType do
  use Absinthe.Schema.Notation
  use Absinthe.Relay.Schema.Notation, :modern
  alias Web.GraphQL.Resolvers.{Catalog, Live}
  alias Web.GraphQL.Middleware.Authenticate

  object :query_type do
    connection field :packs, node_type: :pack do
      resolve(&Live.pack_list/3)
    end

    field :pack, :pack do
      arg(:id, non_null(:id))
      resolve(parsing_node_ids(&Live.pack_get_by_id/2, id: :pack))
    end

    field :question_types, list_of(:question_type) do
      resolve(&Catalog.question_type_list/3)
    end

    field :answer_types, list_of(:answer_type) do
      resolve(&Catalog.answer_type_list/3)
    end
  end
end

defmodule Web.GraphQL.Types.QueryType do
  use Absinthe.Schema.Notation
  use Absinthe.Relay.Schema.Notation, :modern
  alias Web.GraphQL.Resolvers.Live
  alias Web.GraphQL.Middleware.Authenticate

  object :query_type do
    connection field :packs, node_type: :pack do
      resolve(&Live.pack_list/3)
    end

    field :pack, :pack do
      arg(:id, non_null(:id))
      resolve(parsing_node_ids(&Live.pack_get_by_id/2, id: :pack))
    end
  end
end

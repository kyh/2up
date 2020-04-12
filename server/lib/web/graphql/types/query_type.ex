defmodule Web.GraphQL.Types.QueryType do
  use Absinthe.Schema.Notation
  use Absinthe.Relay.Schema.Notation, :modern
  alias Web.GraphQL.Resolvers.Live
  alias Web.GraphQL.Middleware.Authenticate

  object :query_type do
    connection field :packs, node_type: :pack do
      resolve(&Live.pack_list/3)
    end
  end
end

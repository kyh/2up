defmodule Web.GraphQL.Schema do
  use Absinthe.Schema
  use Absinthe.Relay.Schema, :modern

  import_types Web.GraphQL.Types.QueryType
  import_types Web.GraphQL.Types.MutationType
  import_types Web.GraphQL.Types.BaseTypes
  import_types Web.GraphQL.Types.CatalogTypes
  import_types Web.GraphQL.Types.AccountsTypes
  import_types Web.GraphQL.Types.GameTypes

  query do
    import_fields :query_type
  end

  mutation do
    import_fields :mutation_type
  end
end

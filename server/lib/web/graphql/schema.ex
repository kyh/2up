defmodule Web.GraphQL.Schema do
  use Absinthe.Schema
  use Absinthe.Relay.Schema, :modern

  import_types(Web.GraphQL.Types.{
    QueryType,
    MutationType,
    BaseTypes,
    CatalogTypes,
    LiveTypes,
    AccountsTypes,
    GameTypes
  })

  query(do: import_fields(:query_type))
  mutation(do: import_fields(:mutation_type))
end

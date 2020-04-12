defmodule Web.GraphQL.Types.CatalogTypes do
  use Absinthe.Schema.Notation
  use Absinthe.Relay.Schema.Notation, :modern

  node object(:act) do
    field :order, :integer
  end
end

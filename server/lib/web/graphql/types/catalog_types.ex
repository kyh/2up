defmodule Web.GraphQL.Types.CatalogTypes do
  use Absinthe.Schema.Notation
  use Absinthe.Relay.Schema.Notation, :modern

  node object(:act) do
    field :question, non_null(:string)
    field :answer, :string
  end

  connection(node_type: :act)
end

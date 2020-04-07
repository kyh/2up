defmodule Web.GraphQL.Types.CatalogTypes do
  use Absinthe.Schema.Notation
  use Absinthe.Relay.Schema.Notation, :modern

  node object :pack do
    field :name, non_null(:string)
    field :user, :user
  end

  object :question do
    field :id, non_null(:id)
    field :content, non_null(:string)
  end

  connection node_type: :pack
end

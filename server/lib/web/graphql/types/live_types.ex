defmodule Web.GraphQL.Types.LiveTypes do
  use Absinthe.Schema.Notation
  use Absinthe.Relay.Schema.Notation, :modern

  node object :pack do
    field :name, non_null(:string)
    field :user, :user
  end

  connection node_type: :pack
end

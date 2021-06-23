defmodule Web.GraphQL.Types.AssetLibraryTypes do
  use Absinthe.Schema.Notation
  use Absinthe.Relay.Schema.Notation, :modern

  object :asset do
    field :url, non_null(:string)
  end
end

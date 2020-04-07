defmodule Web.GraphQL.Types.BaseTypes do
  use Absinthe.Schema.Notation
  use Absinthe.Relay.Schema.Notation, :modern

  node interface do
    resolve_type fn
      %Database.Catalog.Pack{}, _ ->
        :pack
    end
  end
end

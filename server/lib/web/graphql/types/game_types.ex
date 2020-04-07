defmodule Web.GraphQL.Types.GameTypes do
  use Absinthe.Schema.Notation
  use Absinthe.Relay.Schema.Notation, :modern

  object :code do
    field :code, non_null(:string)
  end

  object :game do
    field :is_valid, non_null(:boolean)
  end
end

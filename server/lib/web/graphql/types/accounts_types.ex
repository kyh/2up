defmodule Web.GraphQL.Types.AccountsTypes do
  use Absinthe.Schema.Notation
  use Absinthe.Relay.Schema.Notation, :modern

  object :user do
    field :username, non_null(:string)
    field :email, non_null(:string)
  end

  object :session do
    field :user, non_null(:user)
    field :token, non_null(:string)
  end
end

defmodule Web.GraphQL.Types.QueryType do
  use Absinthe.Schema.Notation
  use Absinthe.Relay.Schema.Notation, :modern
  alias Web.GraphQL.Resolvers.Catalog

  object :query_type do
    field :questions, list_of(:question) do
      resolve &Catalog.questions/3
    end

    field :question_types, list_of(:string) do
      resolve &Catalog.question_types/3
    end

    field :answer_types, list_of(:string) do
      resolve &Catalog.answer_types/3
    end

    field :packs, list_of(:string) do
      resolve &Catalog.packs/3
    end
  end
end

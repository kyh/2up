defmodule Web.GraphQL.Schema do
  use Absinthe.Schema
  alias Database.{Catalog}

  query do
    @desc "Get a list of questions"
    field :questions, list_of(:question) do
      resolve &Web.Resolvers.Catalog.questions/3
    end
  end

  object :question do
    field :id, non_null(:id)
    field :content, non_null(:string)
  end
end

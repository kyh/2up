defmodule Web.GraphQL.Schema do
  use Absinthe.Schema
  use Absinthe.Relay.Schema, :modern
  use Absinthe.Relay.Schema.Notation, :modern

  import Absinthe.Resolution.Helpers, only: [dataloader: 1, dataloader: 3]

  alias Database.Catalog.{Act, QuestionType, AnswerType}
  alias Database.Accounts.User
  alias Database.Live.Pack

  import_types(Web.GraphQL.Types.{
    QueryType,
    MutationType,
    BaseTypes,
    CatalogTypes,
    LiveTypes,
    AccountsTypes,
    GameTypes
  })

  query(do: import_fields(:query_type))
  mutation(do: import_fields(:mutation_type))

  def context(ctx) do
    source = Dataloader.Ecto.new(Database.Repo)

    loader =
      Dataloader.new()
      |> Dataloader.add_source(Pack, source)
      |> Dataloader.add_source(Act, source)
      |> Dataloader.add_source(QuestionType, source)
      |> Dataloader.add_source(AnswerType, source)
      |> Dataloader.add_source(User, source)

    Map.put(ctx, :loader, loader)
  end

  def plugins do
    [Absinthe.Middleware.Dataloader] ++ Absinthe.Plugin.defaults()
  end
end

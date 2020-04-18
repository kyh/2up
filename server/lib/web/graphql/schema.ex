defmodule Web.GraphQL.Schema do
  use Absinthe.Schema
  use Absinthe.Relay.Schema, :modern
  import Absinthe.Resolution.Helpers, only: [dataloader: 1, dataloader: 3]

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
      Dataloader.new
      |> Dataloader.add_source(Database.Live.Pack, source)

    Map.put(ctx, :loader, loader)
  end

  def plugins do
    [Absinthe.Middleware.Dataloader] ++ Absinthe.Plugin.defaults()
  end
end

defmodule Web.GraphQL.Schema do
  use Absinthe.Schema
  use Absinthe.Relay.Schema, :modern
  use Absinthe.Relay.Schema.Notation, :modern
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

  query do
    import_fields(:query_type)

    node field do
      resolve(fn
        %{type: :act, id: id}, _ ->
          {:ok, Database.Repo.get(Database.Catalog.Act, id)}

        %{type: :pack, id: id}, _ ->
          {:ok, Database.Repo.get(Database.Live.Pack, id)}

        %{type: :answer_type, id: id}, _ ->
          {:ok, Database.Repo.get(Database.Catalog.AnswerType, id)}

        %{type: :question_type, id: id}, _ ->
          {:ok, Database.Repo.get(Database.Catalog.QuestionType, id)}
      end)
    end
  end

  mutation(do: import_fields(:mutation_type))

  def context(ctx) do
    source = Dataloader.Ecto.new(Database.Repo)

    loader =
      Dataloader.new()
      |> Dataloader.add_source(Database.Live.Pack, source)
      |> Dataloader.add_source(Database.Catalog.Act, source)
      |> Dataloader.add_source(Database.Catalog.QuestionType, source)
      |> Dataloader.add_source(Database.Catalog.AnswerType, source)

    Map.put(ctx, :loader, loader)
  end

  def plugins do
    [Absinthe.Middleware.Dataloader] ++ Absinthe.Plugin.defaults()
  end
end

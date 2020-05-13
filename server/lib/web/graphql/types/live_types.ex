defmodule Web.GraphQL.Types.LiveTypes do
  use Absinthe.Schema.Notation
  use Absinthe.Relay.Schema.Notation, :modern

  alias Absinthe.Relay.Connection
  alias Web.GraphQL.Resolvers.Live
  alias Database.Live.Pack
  alias Database.Accounts.User

  import Absinthe.Resolution.Helpers, only: [on_load: 2, dataloader: 1]

  node object(:pack) do
    field :name, non_null(:string)
    field :user, non_null(:user), resolve: dataloader(User)
    field :description, :string
    field :image_url, :string
    field :length, :integer
    field :is_random, :boolean

    connection field :acts, node_type: :act do
      resolve(fn parent, args, %{context: %{loader: loader}} ->
        loader
        |> Dataloader.load(Pack, :acts, parent)
        |> on_load(fn loader ->
          Dataloader.get(loader, Pack, :acts, parent)
          |> Connection.from_list(args)
        end)
      end)
    end
  end

  connection(node_type: :pack)
end

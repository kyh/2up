defmodule Web.GraphQL.Types.LiveTypes do
  use Absinthe.Schema.Notation
  use Absinthe.Relay.Schema.Notation, :modern

  alias Web.GraphQL.Resolvers.{Catalog, Live}

  alias Database.Accounts.User

  import Absinthe.Resolution.Helpers, only: [dataloader: 1]

  node object(:pack) do
    field :name, non_null(:string)
    field :user, non_null(:user), resolve: dataloader(User)
    field :description, :string
    field :image_url, :string
    field :length, :integer
    field :is_random, :boolean

    connection field :scenes, node_type: :scene do
      resolve(fn parent, args, meta ->
        Catalog.ordered_scene_list(parent, Map.merge(args, %{pack_id: parent.id}), meta)
      end)
    end

    connection field :assets, node_type: :pack_asset do
      resolve(fn parent, args, meta ->
        Live.pack_asset_list(parent, Map.merge(args, %{pack_id: parent.id}), meta)
      end)
    end
  end

  connection(node_type: :pack)

  node object(:pack_asset) do
    field :raw_name, non_null(:string)
    field :path, :string
    field :pack, non_null(:pack), resolve: dataloader(Pack)
  end

  connection(node_type: :pack_asset)
end

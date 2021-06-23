defmodule Web.GraphQL.Resolvers.AssetLibrary do
  def presigned_url(_, %{path: path}, _) do
    {:ok, presigned_url} =
      ExAws.Config.new(:s3)
      |> ExAws.S3.presigned_url(:put, "assets.playhouse.gg", path)

    {:ok, %{presigned_url: presigned_url}}
  end

  def list(_, %{path: path}, _) do
    # ExAws.S3.list_objects("assets.playhouse.gg", path)
    # |> ExAws.request!()
    # |> get_in([:body, :contents])
  end
end

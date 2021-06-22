defmodule Web.GraphQL.Resolvers.AssetLibrary do
  def presigned_url(_, %{path: path}, _) do
    presigned_url =
      ExAws.Config.new(:s3)
      |> ExAws.S3.presigned_url(:put, "playhouse.gg", path)

    {:ok, %{presigned_url: presigned_url}}
  end
end

defmodule Web.GraphQL.Resolvers.AssetLibrary do
  def presigned_url_get(_, _, _) do
    presigned_url =
      ExAws.Config.new(:s3)
      |> ExAws.S3.presigned_url(:get, "playhouse.gg", :path, [expires_in: 300])
    {:ok, presigned_url}
  end
end

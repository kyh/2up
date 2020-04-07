defmodule Web.Router do
  use Web, :router

  pipeline :api do
    plug :accepts, ["json"]
    plug Web.GraphQL.Plugs.SetCurrentUser
  end

  scope "/" do
    pipe_through :api

    forward "/graphql", Absinthe.Plug,
      schema: Web.GraphQL.Schema

    forward "/graphiql", Absinthe.Plug.GraphiQL,
      schema: Web.GraphQL.Schema

    get "/", Web.PageController, :index
  end
end

defmodule Web.Router do
  use Web, :router

  pipeline :api do
    plug :accepts, ["json"]
  end

  scope "/", Web do
    pipe_through :api

    get "/", PageController, :index
  end
end

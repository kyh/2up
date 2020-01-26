defmodule RemoteWeb.PageController do
  use RemoteWeb, :controller

  def index(conn, _params) do
    render(conn, "index.html")
  end
end

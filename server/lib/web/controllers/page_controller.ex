defmodule Web.PageController do
  use Web, :controller

  def index(conn, _params) do
    text(conn, "Welcome to the Playhouse API")
  end
end

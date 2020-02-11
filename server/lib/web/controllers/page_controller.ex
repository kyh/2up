defmodule Web.PageController do
  use Web, :controller

  def index(conn, _params) do
    text(conn, "Hi")
  end
end

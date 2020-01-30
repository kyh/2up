defmodule PlayhouseWeb.PageController do
  use PlayhouseWeb, :controller

  def index(conn, _params) do
    text(conn, "Hi")
  end
end

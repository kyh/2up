defmodule RemoteWeb.PageController do
  use RemoteWeb, :controller

  def index(conn, _params) do
    text(conn, "Hi")
  end
end

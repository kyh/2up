defmodule Web.Token do
  @salt "some salt"

  def sign(user) do
    Phoenix.Token.sign(Web.Endpoint, @salt, %{id: user.id})
  end

  def verify(token) do
    Phoenix.Token.verify(Web.Endpoint, @salt, token, [
      max_age: 90 * 24 * 3600
    ])
  end
end

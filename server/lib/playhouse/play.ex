defmodule Playhouse.Play do	
  import Ecto.Query

  alias Playhouse.Repo

  def players_all do
    playersQuery =
      from q in Playhouse.Play.Player, select: map(q, [:id, :name, :score])

    Repo.all(playersQuery)
  end
end

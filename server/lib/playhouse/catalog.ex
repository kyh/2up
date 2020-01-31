defmodule Playhouse.Catalog do
  import Ecto.Adapters.SQL

  def list_plays do
    query(Playhouse.Repo, "SELECT * FROM plays")
  end

  def list_scenes do
    query(Playhouse.Repo, "SELECT * FROM scenes")
  end

  def list_responses do
    query(Playhouse.Repo, "SELECT * FROM responses")
  end

  def list_scenes_by_play(play_id) do
    sql = """
      SELECT * FROM scenes
      LEFT JOIN plays
      ON scenes.play_id = plays.id
      WHERE plays.id = $1
    """

    query(Playhouse.Repo, sql, [play_id])
  end

  def list_responses_by_scene(scene_id) do
    sql = """
      SELECT * FROM responses
      LEFT JOIN scenes
      ON responses.scene_id = scenes.id
      WHERE scenes.id = $1
    """

    query(Playhouse.Repo, sql, [scene_id])
  end
end

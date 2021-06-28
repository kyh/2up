defmodule Database.Authorization do
  use Database.Context

  def check(:pack_create, %User{}, %Pack{}), do: {:ok}

  def check(:pack_create, nil, %Pack{}), do: {:unauthorized}

  def check(:pack_update, %User{id: user_id}, %Pack{user_id: user_id}), do: {:ok}

  def check(:pack_update, %User{}, %Pack{}), do: {:unauthorized}

  def check(:scene_create, %User{id: user_id}, %Pack{user_id: user_id}), do: {:ok}

  def check(:scene_create, %User{}, %Pack{}), do: {:unauthorized}

  def check(:scene_update, %User{id: user_id}, %Scene{pack_id: pack_id}) do
    pack_owner_check(user_id, pack_id)
  end

  def check(:scene_delete, %User{id: user_id}, %Scene{pack_id: pack_id}) do
    pack_owner_check(user_id, pack_id)
  end

  def check(:scene_answer_create, %User{id: user_id}, %Scene{id: scene_id}) do
    scene_owner_check(user_id, scene_id)
  end

  defp pack_owner_check(user_id, pack_id) do
    pack = Repo.get_by(Pack, %{id: pack_id})

    case pack.user_id == user_id do
      true -> {:ok}
      false -> {:unauthorized}
    end
  end

  defp scene_owner_check(user_id, scene_id) do
    scene = Repo.get_by(Scene, %{id: scene_id})
    pack_owner_check(user_id, scene.pack_id)
  end
end

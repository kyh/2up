defmodule Database.Catalog do
  use Database.Context

  def ordered_scene_list(args) do
    query =
      from scene in Scene,
        join: pack_scene in PackScene,
        on: pack_scene.scene_id == scene.id,
        where: pack_scene.pack_id == ^args.pack_id,
        order_by: [asc: pack_scene.order]

    Repo.all(query)
  end

  def scene_list(%{question_type_id: question_type_id, answer_type_id: answer_type_id}) do
    query =
      from scene in Scene,
        where:
          scene.question_type_id == ^question_type_id and scene.answer_type_id == ^answer_type_id

    Repo.all(query)
  end

  def scene_answer_list(args) do
    query =
      from scene_answer in SceneAnswer,
        where: scene_answer.scene_id == ^args.scene_id

    Repo.all(query)
  end

  def scene_list(pack_id) do
    query =
      from scene in Scene,
        join: pack_scene in PackScene,
        on: pack_scene.scene_id == scene.id,
        join: pack in Pack,
        on: pack_scene.pack_id == pack.id,
        join: question_type in QuestionType,
        on: scene.question_type_id == question_type.id,
        join: answer_type in AnswerType,
        on: scene.answer_type_id == answer_type.id,
        select: %{
          question: scene.question,
          scene_id: scene.id,
          pack: pack.name,
          instruction: scene.instruction,
          answer_type: answer_type.slug,
          question_type: question_type.slug
        },
        where: pack.id == ^pack_id

    Repo.all(query)
  end

  def question_type_list do
    Repo.all(QuestionType)
  end

  def answer_type_list do
    Repo.all(AnswerType)
  end

  def pack_create(%User{} = user, attrs) do
    %Pack{}
    |> Pack.changeset(attrs)
    |> Ecto.Changeset.put_assoc(:user, user)
    |> Repo.insert()
  end

  def scene_create(
        %QuestionType{} = question_type,
        %AnswerType{} = answer_type,
        attrs
      ) do
    %Scene{}
    |> Scene.changeset(attrs)
    |> Ecto.Changeset.put_assoc(:question_type, question_type)
    |> Ecto.Changeset.put_assoc(:answer_type, answer_type)
    |> Repo.insert()
  end

  def scene_create(
        %User{} = user,
        attrs
      ) do
    question_type = Repo.get_by(QuestionType, slug: "text")
    answer_type = Repo.get_by(AnswerType, slug: "text")
    pack = Repo.get(Pack, attrs.pack_id)

    {:ok, scene} =
      %Scene{}
      |> Scene.changeset(attrs)
      |> Ecto.Changeset.put_assoc(:question_type, question_type)
      |> Ecto.Changeset.put_assoc(:answer_type, answer_type)
      |> Repo.insert()

    %PackScene{}
    |> PackScene.changeset(%{order: attrs.order})
    |> Ecto.Changeset.put_assoc(:pack, pack)
    |> Ecto.Changeset.put_assoc(:scene, scene)
    |> Repo.insert()

    {:ok, scene}
  end

  def scene_answer_create(%Scene{} = scene, answer, is_correct) do
    %SceneAnswer{}
    |> SceneAnswer.changeset(%{content: answer, is_correct: is_correct})
    |> Ecto.Changeset.put_assoc(:scene, scene)
    |> Repo.insert()
  end

  def calculate_new_order(%{
        id: scene_id,
        before_id: before_id,
        after_id: after_id,
        pack_id: pack_id
      }) do
    before_pack_scene = Repo.get_by(PackScene, scene_id: before_id, pack_id: pack_id)
    after_pack_scene = Repo.get_by(PackScene, scene_id: after_id, pack_id: pack_id)

    Decimal.add(before_pack_scene.order, after_pack_scene.order)
    |> Decimal.div(2)
  end

  def calculate_new_order(%{after_id: after_id, pack_id: pack_id}) do
    after_pack_scene = Repo.get_by(PackScene, scene_id: after_id, pack_id: pack_id)
    Decimal.div(after_pack_scene.order, Decimal.cast(2))
  end

  def calculate_new_order(%{before_id: before_id, pack_id: pack_id}) do
    before_pack_scene = Repo.get_by(PackScene, scene_id: before_id, pack_id: pack_id)
    Decimal.add(before_pack_scene.order, 1)
  end

  def pack_scene_update(
        %User{} = user,
        attrs
      ) do
    new_order = calculate_new_order(attrs)

    Repo.get_by(PackScene, scene_id: attrs.id, pack_id: attrs.pack_id)
    |> PackScene.changeset(%{order: new_order})
    |> Repo.update()
  end

  def scene_update(
        %User{} = user,
        attrs
      ) do
    question_type = Repo.get_by(QuestionType, slug: attrs.question_type_slug)
    answer_type = Repo.get_by(AnswerType, slug: attrs.answer_type_slug)

    attrs =
      attrs
      |> Map.put(:question_type_id, question_type.id)
      |> Map.put(:answer_type_id, answer_type.id)

    Repo.get_by(Scene, id: attrs.id)
    |> Scene.changeset(attrs)
    |> Repo.update()
  end

  def scene_delete(
        %User{} = user,
        %Scene{} = scene,
        attrs
      ) do
    pack = Repo.get_by(Pack, id: attrs.pack_id)

    pack_scene =
      Repo.get_by(PackScene, pack_id: pack.id, scene_id: scene.id)
      |> Repo.delete()

    pack_scenes_query =
      from pack_scene in PackScene,
        select: %{id: pack_scene.id},
        where: pack_scene.scene_id == ^scene.id

    Repo.all(pack_scenes_query)
    |> Enum.count()
    |> case do
      0 -> scene |> Repo.delete()
      _ -> {:ok, scene}
    end
  end

  def question_type_create(attrs) do
    %QuestionType{}
    |> QuestionType.changeset(attrs)
    |> Repo.insert()
  end

  def answer_type_create(attrs) do
    %AnswerType{}
    |> AnswerType.changeset(attrs)
    |> Repo.insert()
  end

  def scene_get_by_id(%{id: id, pack_id: pack_id}) do
    query =
      from scene in Scene,
        join: pack_scene in PackScene,
        on: pack_scene.scene_id == scene.id,
        join: pack in Pack,
        on: pack_scene.pack_id == pack.id,
        where: pack.id == ^pack_id,
        where: scene.id == ^id,
        order_by: [asc: pack_scene.order],
        limit: 1

    Repo.one(query)
  end

  def scene_get_by_id(%{id: id}) do
    Repo.get_by(Scene, id: id)
  end

  def scene_get_by_id(%{pack_id: pack_id}) do
    query =
      from scene in Scene,
        join: pack_scene in PackScene,
        on: pack_scene.scene_id == scene.id,
        join: pack in Pack,
        on: pack_scene.pack_id == pack.id,
        where: pack.id == ^pack_id,
        order_by: [asc: pack_scene.order],
        limit: 1

    Repo.one(query)
  end
end

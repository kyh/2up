defmodule Database.Catalog do
  use Database.Context
  alias Database.Authorization

  def ordered_scene_list(args) do
    query =
      from scene in Scene,
        where: scene.pack_id == ^args.pack_id,
        order_by: [asc: scene.order]

    Repo.all(query)
  end

  def scene_list(%{question_type_id: question_type_id, answer_type_id: answer_type_id}) do
    query =
      from scene in Scene,
        where:
          scene.question_type_id == ^question_type_id and scene.answer_type_id == ^answer_type_id

    Repo.all(query)
  end

  def scene_list(pack_id) do
    query =
      from scene in Scene,
        join: pack in Pack,
        on: scene.pack_id == pack.id,
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

  def scene_answer_list(args) do
    query =
      from scene_answer in SceneAnswer,
        where: scene_answer.scene_id == ^args.scene_id,
        order_by: [asc: scene_answer.id]

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
        %User{} = user,
        %Pack{} = pack,
        %QuestionType{} = question_type,
        %AnswerType{} = answer_type,
        attrs
      ) do
    with {:ok} <- Authorization.check(:scene_create, user, pack) do
      %Scene{}
      |> Scene.changeset(attrs)
      |> Ecto.Changeset.put_assoc(:pack, pack)
      |> Ecto.Changeset.put_assoc(:question_type, question_type)
      |> Ecto.Changeset.put_assoc(:answer_type, answer_type)
      |> Repo.insert()
    end
  end

  def scene_create(
        %User{} = user,
        attrs
      ) do
    pack = Repo.get(Pack, attrs.pack_id)

    with {:ok} <- Authorization.check(:scene_create, user, pack) do
      question_type = Repo.get_by(QuestionType, slug: attrs.question_type_slug)
      answer_type = Repo.get_by(AnswerType, slug: attrs.answer_type_slug)

      pack = Repo.get(Pack, attrs.pack_id)

      scene =
        %Scene{}
        |> Scene.changeset(attrs)
        |> Ecto.Changeset.put_assoc(:pack, pack)
        |> Ecto.Changeset.put_assoc(:question_type, question_type)
        |> Ecto.Changeset.put_assoc(:answer_type, answer_type)
        |> Repo.insert!()

      Enum.each(attrs.scene_answers, fn a ->
        %SceneAnswer{}
        |> SceneAnswer.changeset(a)
        |> Ecto.Changeset.put_assoc(:scene, scene)
        |> Repo.insert()
      end)

      {:ok, scene}
    end
  end

  def scene_answer_create(%User{} = user, %Scene{} = scene, answer, is_correct) do
    with {:ok} <- Authorization.check(:scene_answer_create, user, scene) do
      %SceneAnswer{}
      |> SceneAnswer.changeset(%{content: answer, is_correct: is_correct})
      |> Ecto.Changeset.put_assoc(:scene, scene)
      |> Repo.insert()
    end
  end

  def scene_order_update(
        %User{} = user,
        attrs
      ) do
    scene = Repo.get_by(Scene, id: attrs.id)

    with {:ok} <- Authorization.check(:scene_update, user, scene) do
      new_order = calculate_new_order(attrs)

      scene
      |> Scene.changeset(%{order: new_order})
      |> Repo.update()
    end
  end

  def scene_update(
        %User{} = user,
        attrs
      ) do
    scene = Repo.get_by(Scene, id: attrs.id)

    with {:ok} <- Authorization.check(:scene_update, user, scene) do
      question_type = Repo.get_by(QuestionType, slug: attrs.question_type_slug)
      answer_type = Repo.get_by(AnswerType, slug: attrs.answer_type_slug)

      attrs =
        attrs
        |> Map.put(:question_type_id, question_type.id)
        |> Map.put(:answer_type_id, answer_type.id)

      Enum.each(attrs.scene_answers, fn a ->
        attrs = a |> Map.put(:scene_id, attrs.id)

        scene_answer =
          case Map.has_key?(a, :id) do
            false ->
              %SceneAnswer{}

            true ->
              case Repo.get(SceneAnswer, a.id) do
                nil -> %SceneAnswer{}
                scene_answer -> scene_answer
              end
          end

        scene_answer
        |> SceneAnswer.changeset(attrs)
        |> Repo.insert_or_update()
      end)

      scene
      |> Scene.changeset(attrs)
      |> Repo.update()
    end
  end

  def scene_delete(
        %User{} = user,
        %Scene{} = scene,
        _attrs
      ) do
    with {:ok} <- Authorization.check(:scene_delete, user, scene) do
      query =
        from scene_answer in SceneAnswer,
          where: scene_answer.scene_id == ^scene.id

      Repo.delete_all(query)
      scene |> Repo.delete()
    end
  end

  def scene_answer_delete(
        %User{} = user,
        %SceneAnswer{} = scene_answer,
        _attrs
      ) do
    scene = Repo.get_by(Scene, id: scene_answer.scene_id)

    with {:ok} <- Authorization.check(:scene_answer_delete, user, scene) do
      scene_answer |> Repo.delete()
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

  def scene_get_by_id(%{id: id}) do
    Repo.get_by(Scene, id: id)
  end

  def scene_get_by_id(%{pack_id: pack_id}) do
    query =
      from scene in Scene,
        join: pack in Pack,
        on: scene.pack_id == pack.id,
        where: pack.id == ^pack_id,
        order_by: [asc: scene.order],
        limit: 1

    Repo.one(query)
  end

  defp calculate_new_order(%{before_id: before_id, after_id: after_id}) do
    before_scene = Repo.get_by(Scene, id: before_id)
    after_scene = Repo.get_by(Scene, id: after_id)

    Decimal.add(before_scene.order, after_scene.order)
    |> Decimal.div(2)
  end

  defp calculate_new_order(%{after_id: after_id}) do
    after_scene = Repo.get_by(Scene, id: after_id)
    Decimal.div(after_scene.order, Decimal.new(2))
  end

  defp calculate_new_order(%{before_id: before_id}) do
    before_scene = Repo.get_by(Scene, id: before_id)
    Decimal.add(before_scene.order, 1)
  end
end

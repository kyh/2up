defmodule Database.Catalog do
  use Database.Context

  def act_list(%{tag_ids: tag_ids}) do
    query =
      from act in Act,
        join: act_tag in ActTag,
        on: act_tag.act_id == act.id,
        where: act_tag.tag_id in ^tag_ids

    Repo.all(query)
  end

  def question_list(tag_name) do
    tag_query =
      from act in Act,
        select: %{question: act.question, answer: act.answer},
        join: act_tag in ActTag,
        on: act_tag.act_id == act.id,
        join: tag in Tag,
        on: act_tag.tag_id == tag.id,
        where: tag.name == ^tag_name

    all_query =
      from act in Act,
        select: %{question: act.question, answer: act.answer}

    case tag_name do
      "Variety" -> Repo.all(all_query)
      _ -> Repo.all(tag_query)
    end
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

  def act_create(
        %User{} = user,
        %QuestionType{} = question_type,
        %AnswerType{} = answer_type,
        attrs
      ) do
    %Act{}
    |> Act.changeset(attrs)
    |> Ecto.Changeset.put_assoc(:user, user)
    |> Ecto.Changeset.put_assoc(:question_type, question_type)
    |> Ecto.Changeset.put_assoc(:answer_type, answer_type)
    |> Repo.insert()
  end

  def act_create(
        %User{} = user,
        attrs
      ) do
    question_type = Repo.get_by(QuestionType, slug: "text")
    answer_type = Repo.get_by(AnswerType, slug: "text")
    pack = Repo.get(Pack, attrs.pack_id)

    {:ok, act} =
      %Act{}
      |> Act.changeset(attrs)
      |> Ecto.Changeset.put_assoc(:user, user)
      |> Ecto.Changeset.put_assoc(:question_type, question_type)
      |> Ecto.Changeset.put_assoc(:answer_type, answer_type)
      |> Repo.insert()

    %PackAct{}
    |> PackAct.changeset(%{order: attrs.order})
    |> Ecto.Changeset.put_assoc(:pack, pack)
    |> Ecto.Changeset.put_assoc(:act, act)
    |> Repo.insert()

    {:ok, act}
  end

  def act_update(
        %User{} = user,
        attrs
      ) do
    act = Repo.get_by(Act, id: attrs.id)
    # question_type = Repo.get_by(QuestionType, id: args.question_type_id)
    # answer_type = Repo.get_by(AnswerType, id: args.answer_type_id)
    # TODO: Check if this user is the author
    act
    |> Act.changeset(attrs)
    # |> Ecto.Changeset.put_assoc(:question_type, question_type)
    # |> Ecto.Changeset.put_assoc(:answer_type, answer_type)
    |> Repo.update()
  end

  def act_delete(
        %User{} = user,
        %Act{} = act,
        attrs
      ) do
    pack = Repo.get_by(Pack, id: attrs.pack_id)

    pack_act =
      Repo.get_by(PackAct, pack_id: pack.id, act_id: act.id)
      |> Repo.delete()

    pack_acts_query =
      from pack_act in PackAct,
        select: %{id: pack_act.id},
        where: pack_act.act_id == ^act.id

    Repo.all(pack_acts_query)
    |> Enum.count()
    |> case do
      0 -> act |> Repo.delete()
      _ -> {:ok, act}
    end
  end

  def act_tag_create(%Act{} = act, %Tag{} = tag) do
    %ActTag{}
    |> ActTag.changeset(%{})
    |> Ecto.Changeset.put_assoc(:act, act)
    |> Ecto.Changeset.put_assoc(:tag, tag)
    |> Repo.insert()
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

  def act_get_by_id(id) do
    Repo.get_by(Act, id: id)
  end
end

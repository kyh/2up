defmodule Database.Catalog do
  use Database.Context

  def ordered_act_list(args) do
    query =
      from act in Act,
        join: pack_act in PackAct,
        on: pack_act.act_id == act.id,
        where: pack_act.pack_id == ^args.pack_id,
        order_by: [asc: pack_act.order]

    Repo.all(query)
  end

  def act_list(%{tag_ids: tag_ids}) do
    query =
      from act in Act,
        join: act_tag in ActTag,
        on: act_tag.act_id == act.id,
        where: act_tag.tag_id in ^tag_ids

    Repo.all(query)
  end

  def act_list(%{question_type_id: question_type_id, answer_type_id: answer_type_id}) do
    query =
      from act in Act,
        where: act.question_type_id == ^question_type_id and act.answer_type_id == ^answer_type_id

    Repo.all(query)
  end

  def question_list(pack_id) do
    tag_query =
      from act in Act,
        join: pack_act in PackAct,
        on: pack_act.act_id == act.id,
        join: pack in Pack,
        on: pack_act.pack_id == pack.id,
        join: question_type in QuestionType,
        on: act.question_type_id == question_type.id,
        join: answer_type in AnswerType,
        on: act.answer_type_id == answer_type.id,
        select: %{
          question: act.question,
          answer: act.answer,
          pack: pack.name,
          instruction: act.instruction,
          answer_type: answer_type.slug,
          question_type: question_type.slug
        },
        where: pack.id == ^pack_id

    Repo.all(tag_query)
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

  def calculate_new_order(%{
        id: act_id,
        before_id: before_id,
        after_id: after_id,
        pack_id: pack_id
      }) do

    before_pack_act = Repo.get_by(PackAct, act_id: before_id, pack_id: pack_id)
    after_pack_act = Repo.get_by(PackAct, act_id: after_id, pack_id: pack_id)

    Decimal.add(before_pack_act.order, after_pack_act.order)
    |> Decimal.div(2)
  end

  def calculate_new_order(%{after_id: after_id, pack_id: pack_id}) do
    after_pack_act = Repo.get_by(PackAct, act_id: after_id, pack_id: pack_id)
    Decimal.div(after_pack_act.order, Decimal.cast(2))
  end

  def calculate_new_order(%{before_id: before_id, pack_id: pack_id}) do
    before_pack_act = Repo.get_by(PackAct, act_id: before_id, pack_id: pack_id)
    Decimal.add(before_pack_act.order, 1)
  end

  def pack_act_update(
        %User{} = user,
        attrs
      ) do
    new_order = calculate_new_order(attrs)
    Repo.get_by(PackAct, act_id: attrs.id, pack_id: attrs.pack_id)
    |> PackAct.changeset(%{order: new_order})
    |> Repo.update()
  end

  def act_update(
        %User{} = user,
        attrs
      ) do
    question_type = Repo.get_by(QuestionType, slug: attrs.question_type_slug)
    answer_type = Repo.get_by(AnswerType, slug: attrs.answer_type_slug)

    attrs =
      attrs
      |> Map.put(:question_type_id, question_type.id)
      |> Map.put(:answer_type_id, answer_type.id)

    Repo.get_by(Act, id: attrs.id)
    |> Act.changeset(attrs)
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

  def act_get_by_id(%{id: id, pack_id: pack_id}) do
    query =
      from act in Act,
        join: pack_act in PackAct,
        on: pack_act.act_id == act.id,
        join: pack in Pack,
        on: pack_act.pack_id == pack.id,
        where: pack.id == ^pack_id,
        where: act.id == ^id,
        order_by: [asc: pack_act.order],
        limit: 1

    Repo.one(query)
  end

  def act_get_by_id(%{id: id}) do
    Repo.get_by(Act, id: id)
  end

  def act_get_by_id(%{pack_id: pack_id}) do
    query =
      from act in Act,
        join: pack_act in PackAct,
        on: pack_act.act_id == act.id,
        join: pack in Pack,
        on: pack_act.pack_id == pack.id,
        where: pack.id == ^pack_id,
        order_by: [asc: pack_act.order],
        limit: 1

    Repo.one(query)
  end
end

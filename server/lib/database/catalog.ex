defmodule Database.Catalog do
  use Database.Context

  def random_question do
    query =
      from Question,
        order_by: fragment("RANDOM()"),
        limit: 1

    Repo.one(query)
  end

  def generate_code do
    :io_lib.format("~4..0B", [:rand.uniform(10_000) - 1])
    |> List.to_string()
  end

  def random_formatted_questions(size) do
    query =
      from Question,
        order_by: fragment("RANDOM()"),
        limit: ^size

    Repo.all(query)
    |> Enum.map(fn x ->
      [x.content, x.answer]
    end)
  end

  def pack_list() do
    Repo.all(Pack)
  end

  def act_list(%{tag_ids: tag_ids}) do
    query =
      from act in Act,
        join: act_tag in ActTag,
        on: act_tag.act_id == act.id,
        where: act_tag.tag_id in ^tag_ids

    Repo.all(query)
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
end

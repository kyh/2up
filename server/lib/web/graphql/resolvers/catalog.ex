defmodule Web.GraphQL.Resolvers.Catalog do
  alias Database.Catalog
  alias Web.GraphQL.Errors

  def act_create(args, %{context: %{current_user: user}}) do
    question_type = Database.Repo.get_by(Database.Catalog.QuestionType, id: args.question_type_id)
    answer_type = Database.Repo.get_by(Database.Catalog.AnswerType, id: args.answer_type_id)
    pack = Database.Repo.get_by(Database.Live.Pack, id: args.pack_id)

    case Catalog.act_create(user, pack, question_type, answer_type, args) do
      {:error, changeset} ->
        {
          :error,
          message: "Act creation failed", details: Errors.error_details(changeset)
        }

      {:ok, act} ->
        {:ok, %{act: act}}
    end
  end

  def question_type_list(_, _, _) do
    {:ok, Catalog.question_type_list()}
  end

  def answer_type_list(_, _, _) do
    {:ok, Catalog.answer_type_list()}
  end
end

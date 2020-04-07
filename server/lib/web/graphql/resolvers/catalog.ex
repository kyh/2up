defmodule Web.GraphQL.Resolvers.Catalog do
  alias Database.Catalog

  def questions(_, _, _) do
    {:ok, Catalog.list_questions()}
  end

  def question_types(_, _, _) do
    {:ok, ["TEXT", "COLOR", "MAP", "MATH", "IMAGE"]}
  end

  def answer_types(_, _, _) do
    {:ok, ["TEXT", "COLOR", "MAP", "BUTTON", "MATH"]}
  end

  def play_list(_, _, _) do
    {:ok, Catalog.play_list()}
  end

  def pack_list(_, _, _) do
    {:ok, Catalog.pack_list()}
  end

  def pack_create(_, args, %{context: %{current_user: user}}) do
    case Catalog.pack_create(user, args) do
      {:error, changeset} ->
        {
          :error,
          message: "Pack creation failed",
          details: Errors.error_details(changeset)
        }

      {:ok, pack} ->
        {:ok, %{pack: pack}}
    end
  end
end

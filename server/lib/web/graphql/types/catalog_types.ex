defmodule Web.GraphQL.Types.CatalogTypes do
  use Absinthe.Schema.Notation
  use Absinthe.Relay.Schema.Notation, :modern

  alias Web.GraphQL.Resolvers.Catalog

  alias Database.Catalog.{QuestionType, AnswerType}

  import Absinthe.Resolution.Helpers, only: [dataloader: 1]

  node object(:scene) do
    field :question, non_null(:string)
    field :instruction, :string

    field :question_type, non_null(:question_type), resolve: dataloader(QuestionType)
    field :answer_type, non_null(:answer_type), resolve: dataloader(AnswerType)

    field :scene_answers, list_of(:scene_answer) do
      resolve(fn parent, args, meta ->
        Catalog.scene_answer_list(parent, Map.merge(args, %{scene_id: parent.id}), meta)
      end)
    end
  end

  connection(node_type: :scene)

  node object(:scene_answer) do
    field :content, :string
    field :is_correct, non_null(:boolean)
    # field :scene, non_null(:scene), resolve: dataloader(Scene)
  end

  connection(node_type: :scene_answer)

  node object(:question_type) do
    field :slug, non_null(:string)
  end

  node object(:answer_type) do
    field :slug, non_null(:string)
  end

  object(:pack_scene) do
    field :id, :id
    field :order, non_null(:string)
  end

  input_object :scene_answer_input do
    field :id, :id
    field :scene_id, :id
    field :content, :string
    field :is_correct, non_null(:boolean)
  end
end

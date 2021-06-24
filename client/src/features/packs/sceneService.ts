import { useMutation, makeVar } from "@apollo/client";
import { useAlert } from "react-alert";
import { Props, SCENE_UPDATE } from "./components/ScenePreview";
import {
  SceneUpdateMutation,
  SceneUpdateMutation_sceneUpdate_scene,
} from "./components/__generated__/SceneUpdateMutation";

export const useUpdateScene = ({ scene }: Props) => {
  const alert = useAlert();
  const [sceneUpdate] = useMutation<SceneUpdateMutation>(SCENE_UPDATE);

  const updateScene = async (updatedScene = {}) => {
    savingSceneVar(true);
    const newScene = { ...scene, ...updatedScene };
    console.log("Update new Scene:", newScene);
    try {
      await sceneUpdate({
        variables: {
          input: {
            id: newScene.id || "",
            instruction: newScene.instruction,
            questionTypeSlug: newScene.questionType.slug,
            question: newScene.question,
            answerTypeSlug: newScene.answerType.slug,
            sceneAnswers: newScene.sceneAnswers,
          },
        },
      });
      savingSceneVar(false);
    } catch (error) {
      alert.show(error.message);
      savingSceneVar(false);
    }
  };

  return { updateScene };
};

export enum VisibleQATypeMenu {
  None,
  Question,
  Answer,
}

export const visibleQATypeMenuVar = makeVar(VisibleQATypeMenu.None);
export const savingSceneVar = makeVar(false);

export const toCSVString = (
  scenes: Pick<
    SceneUpdateMutation_sceneUpdate_scene,
    | "id"
    | "instruction"
    | "question"
    | "questionType"
    | "sceneAnswers"
    | "answerType"
  >[]
) => {
  return scenes
    .map((s) => {
      const sceneAnswers = s.sceneAnswers?.map((a) => a?.content || "");
      return [
        s.id,
        s.instruction,
        s.questionType.slug,
        s.question,
        s.answerType.slug,
        ...(sceneAnswers || []),
      ].join();
    })
    .join("\n");
};

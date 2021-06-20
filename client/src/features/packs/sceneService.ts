import { useMutation, makeVar } from "@apollo/client";
import { useAlert } from "react-alert";
import { Props, SCENE_UPDATE } from "./components/ScenePreview";
import { SceneUpdateMutation } from "./components/__generated__/SceneUpdateMutation";

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

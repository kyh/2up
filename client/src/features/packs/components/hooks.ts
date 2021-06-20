import { useMutation } from "@apollo/client";
import { useAlert } from "react-alert";
import { Props, SCENE_UPDATE } from "./ScenePreview";
import { ScenePreviewSceneUpdateMutation } from "./__generated__/ScenePreviewSceneUpdateMutation";
import { savingSceneVar } from "./cache";

export const useUpdateScene = ({ scene }: Props) => {
  const alert = useAlert();
  const [sceneUpdate] = useMutation<ScenePreviewSceneUpdateMutation>(
    SCENE_UPDATE
  );

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

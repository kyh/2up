import { EditableQuestion } from "~/lib/packs/components/EditableQuestion";
import { EditableAnswer } from "~/lib/packs/components/EditableAnswer";
import { useUpdateScene } from "~/lib/packs/useSceneActions";
import { SceneWithAnswers } from "~/lib/packs/packStore";

export type Props = {
  scene: SceneWithAnswers;
};

export const ScenePreview = ({ scene }: Props) => {
  const { updateScene } = useUpdateScene(scene);

  return (
    <>
      <EditableQuestion
        sceneId={scene.id}
        questionDescription={scene.questionDescription || ""}
        question={scene.question || ""}
        questionType={scene.questionType}
        onChange={updateScene}
      />
      <EditableAnswer
        sceneId={scene.id}
        sceneAnswers={scene.answers}
        answerType={scene.answerType}
        onChange={updateScene}
      />
    </>
  );
};

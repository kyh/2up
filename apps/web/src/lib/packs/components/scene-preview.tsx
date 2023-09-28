import { EditableQuestion } from "~/lib/packs/components/editable-question";
import { EditableAnswer } from "~/lib/packs/components/editable-answer";
import { useUpdateScene } from "~/lib/packs/use-scene-actions";
import { SceneWithAnswers } from "~/lib/packs/pack-store";

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

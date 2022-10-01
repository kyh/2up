import { EditableQuestion } from "~/lib/packs/components/EditableQuestion";
import { EditableAnswer } from "~/lib/packs/components/EditableAnswer";
import { useUpdateScene } from "~/lib/packs/useSceneActions";

export type Props = {
  scene: any;
};

export const ScenePreview = ({ scene }: Props) => {
  const { updateScene } = useUpdateScene(scene);

  return (
    <>
      <EditableQuestion
        sceneId={scene.id}
        instruction={scene.instruction || ""}
        question={scene.question || ""}
        questionType={scene.questionType.slug}
        onChange={updateScene}
      />
      <EditableAnswer
        sceneId={scene.id}
        sceneAnswers={scene.sceneAnswers}
        answerType={scene.answerType.slug}
        onChange={updateScene}
      />
    </>
  );
};

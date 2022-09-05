import { EditableQuestion } from "~/lib/packs/components/EditableQuestion";
import { EditableAnswer } from "~/lib/packs/components/EditableAnswer";
import { useUpdateScene } from "~/lib/packs/sceneService";
import {
  SceneFragment,
  SceneFragment_sceneAnswers,
} from "../__generated__/SceneFragment";

export type Props = {
  scene: SceneFragment;
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
        sceneAnswers={scene.sceneAnswers as SceneFragment_sceneAnswers[]}
        answerType={scene.answerType.slug}
        onChange={updateScene}
      />
    </>
  );
};

import { gql } from "@apollo/client";
import { EditableQuestion } from "features/packs/components/EditableQuestion";
import { EditableAnswer } from "features/packs/components/EditableAnswer";
import { useUpdateScene } from "features/packs/packService";
import { SCENE_FRAGMENT } from "features/packs/packFragments";

import {
  SceneFragment,
  SceneFragment_sceneAnswers,
} from "../__generated__/SceneFragment";

export type Props = {
  scene: SceneFragment;
};

export const ScenePreview = ({ scene }: Props) => {
  const { updateScene } = useUpdateScene({ scene });

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

export const SCENE_UPDATE = gql`
  mutation SceneUpdateMutation($input: SceneUpdateInput!) {
    sceneUpdate(input: $input) {
      scene {
        ...SceneFragment
      }
    }
  }
  ${SCENE_FRAGMENT}
`;

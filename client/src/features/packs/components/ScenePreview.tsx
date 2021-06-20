import { gql } from "@apollo/client";
import { EditableQuestion } from "features/packs/components/EditableQuestion";
import { EditableAnswer } from "features/packs/components/EditableAnswer";

import {
  ScenePreviewFragment,
  ScenePreviewFragment_sceneAnswers,
} from "./__generated__/ScenePreviewFragment";
import { useUpdateScene } from "../sceneService";

export type Props = {
  scene: ScenePreviewFragment;
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
        sceneAnswers={scene.sceneAnswers as ScenePreviewFragment_sceneAnswers[]}
        answerType={scene.answerType.slug}
        onChange={updateScene}
      />
    </>
  );
};

ScenePreview.fragments = {
  scene: gql`
    fragment ScenePreviewFragment on Scene {
      id
      instruction
      question
      questionType {
        id
        slug
      }
      sceneAnswers {
        id
        content
        isCorrect
      }
      answerType {
        id
        slug
      }
    }
  `,
};

export const SCENE_UPDATE = gql`
  mutation SceneUpdateMutation($input: SceneUpdateInput!) {
    sceneUpdate(input: $input) {
      scene {
        ...ScenePreviewFragment
      }
    }
  }
  ${ScenePreview.fragments.scene}
`;

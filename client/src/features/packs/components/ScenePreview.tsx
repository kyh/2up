import { useParams } from "react-router-dom";
import { gql, useMutation } from "@apollo/client";
import { EditableQuestion } from "features/packs/components/EditableQuestion";
import { EditableAnswer } from "features/packs/components/EditableAnswer";
import { useUpdateScene } from "features/packs/sceneService";

import {
  ScenePreviewFragment,
  ScenePreviewFragment_sceneAnswers,
} from "./__generated__/ScenePreviewFragment";
import { PresignedUrlCreateMutation } from "./__generated__/PresignedUrlCreateMutation";

export type Props = {
  scene: ScenePreviewFragment;
};

export const ScenePreview = ({ scene }: Props) => {
  const { packId } = useParams<{ packId: string }>();
  const { updateScene } = useUpdateScene({ scene });
  const [presignedUrlCreate] = useMutation<PresignedUrlCreateMutation>(
    PRESIGNED_URL_CREATE
  );

  const createPresignedUrl = async () => {
    const filename = "test.jpeg";
    const { data } = await presignedUrlCreate({
      variables: { input: { path: `${packId}/${scene.id}_${filename}` } },
    });
    console.log(data);
  };

  return (
    <>
      <button onClick={createPresignedUrl}>Create url</button>
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

const PRESIGNED_URL_CREATE = gql`
  mutation PresignedUrlCreateMutation($input: PresignedUrlCreateInput!) {
    presignedUrlCreate(input: $input) {
      url
    }
  }
`;

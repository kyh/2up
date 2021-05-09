import styled from "styled-components";
import { gql, useMutation } from "@apollo/client";
import { useAlert } from "react-alert";

import { EditableQuestion } from "features/game/components/Question";
import { EditableAnswer } from "features/game/components/Answer";

import monitor from "./monitor.svg";
import mobile from "./mobile.svg";

import { SceneUpdateMutation } from "./__generated__/SceneUpdateMutation";
import { ScenePreviewFragment } from "./__generated__/ScenePreviewFragment";

type Props = {
  scene: ScenePreviewFragment;
  setSaving: (saved: boolean) => void;
};

export const ScenePreview = ({ scene, setSaving }: Props) => {
  const alert = useAlert();
  const [sceneUpdate] = useMutation<SceneUpdateMutation>(SCENE_UPDATE);

  const onChange = async (updatedScene = {}) => {
    setSaving(true);
    const newScene = { ...scene, ...updatedScene };
    try {
      await sceneUpdate({
        variables: {
          input: {
            id: newScene.id,
            question: newScene.question,
            question_type_slug: newScene.questionType.slug,
            sceneAnswers: newScene.sceneAnswers,
            answer_type_slug: newScene.answerType.slug,
            instruction: newScene.instruction,
          },
        },
      });
      setSaving(false);
    } catch (error) {
      alert.show(error.message);
      setSaving(false);
    }
  };

  return (
    <Container>
      <Monitor>
        <Screen>
          <EditableQuestion
            sceneId={scene.id}
            instruction={scene?.instruction || ""}
            question={scene?.question || ""}
            questionType={scene?.questionType?.slug}
            onChange={onChange}
          />
        </Screen>
      </Monitor>
      <Mobile>
        <Screen>
          <EditableAnswer
            sceneId={scene.id}
            sceneAnswers={scene?.sceneAnswers || []}
            answerType={scene?.answerType?.slug}
            onChange={onChange}
          />
        </Screen>
      </Mobile>
    </Container>
  );
};

ScenePreview.fragments = {
  scene: gql`
    fragment ScenePreviewFragment on Scene {
      id
      question
      sceneAnswers
      instruction
      questionType {
        id
        slug
      }
      answerType {
        id
        slug
      }
    }
  `,
};

const SCENE_UPDATE = gql`
  mutation SceneUpdateMutation($input: SceneUpdateInput!) {
    sceneUpdate(input: $input) {
      scene {
        ...ScenePreviewFragment
      }
    }
  }
  ${ScenePreview.fragments.scene}
`;

const Container = styled.section`
  display: flex;
  align-items: center;
`;

const Monitor = styled.section`
  background-image: url(${monitor});
  background-repeat: no-repeat;
  background-size: 100%;
  padding: 30px 30px 130px;
  width: 500px;
  height: 400px;
  margin-right: 20px;
`;

const Mobile = styled.section`
  background-image: url(${mobile});
  background-repeat: no-repeat;
  background-size: 100%;
  padding: 61px 16px 64px 27px;
  width: 270px;
  height: 525px;
`;

const Screen = styled.section`
  position: relative;
  text-align: center;
  background-color: ${({ theme }) => theme.ui.background};
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: ${({ theme }) => theme.spacings(2)};
  height: 100%;
  overflow-y: auto;
  overflow-x: hidden;
`;

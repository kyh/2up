import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { gql } from "apollo-boost";
import { useMutation } from "@apollo/react-hooks";
import { useAlert } from "react-alert";

import { EditableQuestion } from "features/game/components/Question";
import { EditableAnswer } from "features/game/components/Answer";

import monitor from "./monitor.svg";

import { ActPreviewActUpdateMutation } from "./__generated__/ActPreviewActUpdateMutation";
import { ActPreviewFragment } from "./__generated__/ActPreviewFragment";

type Props = {
  act: ActPreviewFragment;
  setSaving: (saved: boolean) => void;
};

export const ActPreview = ({ act, setSaving }: Props) => {
  const alert = useAlert();
  const [editableAct, setEditableAct] = useState(act);
  const [actUpdate] = useMutation<ActPreviewActUpdateMutation>(ACT_UPDATE);

  useEffect(() => {
    setEditableAct(act);
  }, [act]);

  const onChange = async (updatedAct = {}) => {
    setSaving(true);
    const newAct = { ...editableAct, ...updatedAct };
    try {
      await actUpdate({
        variables: {
          input: {
            id: newAct.id,
            question: newAct.question,
            question_type_slug: newAct.questionType.slug,
            answer: newAct.answer,
            answer_type_slug: newAct.answerType.slug,
            instruction: newAct.instruction,
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
    <Monitor>
      <MonitorScreenContainer>
        <MonitorScreen>
          <EditableQuestion
            instruction={editableAct?.instruction || ""}
            question={editableAct?.question}
            questionType={editableAct?.questionType?.slug}
            onChange={onChange}
          />
          <EditableAnswer
            answer={editableAct?.answer || ""}
            answerType={editableAct?.answerType?.slug}
            onChange={onChange}
          />
        </MonitorScreen>
      </MonitorScreenContainer>
    </Monitor>
  );
};

ActPreview.fragments = {
  act: gql`
    fragment ActPreviewFragment on Act {
      id
      question
      answer
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

const ACT_UPDATE = gql`
  mutation ActPreviewActUpdateMutation($input: ActUpdateInput!) {
    actUpdate(input: $input) {
      act {
        ...ActPreviewFragment
      }
    }
  }
  ${ActPreview.fragments.act}
`;

const Monitor = styled.section`
  background-image: url(${monitor});
  background-repeat: no-repeat;
  background-size: 100%;
  padding: 43px 43px 120px;
  width: 700px;
  height: 500px;
`;

const MonitorScreenContainer = styled.section`
  height: 100%;
  overflow: auto;
`;

const MonitorScreen = styled.section`
  position: relative;
  text-align: center;
  min-height: 335px;
  background-color: ${({ theme }) => theme.ui.background};
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: ${({ theme }) => theme.spacings(5)};
`;

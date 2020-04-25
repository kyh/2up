import React, { useState, useEffect } from "react";
import { useAlert } from "react-alert";
import styled from "styled-components";
import graphql from "babel-plugin-relay/macro";

import { useMutation } from "utils/useMutation";
import { EditableQuestion } from "features/game/components/Question";
import { EditableAnswer } from "features/game/components/Answer";
import { useRefetchableFragment } from "react-relay/hooks";

import monitor from "./monitor.svg";

import { ActPreviewActUpdateMutation } from "./__generated__/ActPreviewActUpdateMutation.graphql";
import { ActPreview_act$key } from "./__generated__/ActPreview_act.graphql";

const actUpdateMutation = graphql`
  mutation ActPreviewActUpdateMutation($input: ActUpdateInput!) {
    actUpdate(input: $input) {
      act {
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
    }
  }
`;

type Props = {
  act: ActPreview_act$key;
  selectedActId: string;
};

export const ActPreview: React.FC<Props> = ({ act, selectedActId }) => {
  const alert = useAlert();

  const [data, refetch] = useRefetchableFragment(
    graphql`
      fragment ActPreview_act on RootQueryType
        @argumentDefinitions(actId: { type: "ID!" })
        @refetchable(queryName: "SidebarActsQuery") {
        act(id: $actId) {
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
      }
    `,
    act
  );

  const [editableAct, setEditableAct] = useState(data?.act);
  const [actUpdate, isUpdatingAct] = useMutation<ActPreviewActUpdateMutation>(
    actUpdateMutation
  );

  useEffect(() => {
    if (data && data.act) {
      setEditableAct(data.act);
    }
  }, [data?.act]);

  useEffect(() => {
    refetch({ actId: selectedActId });
  }, [selectedActId]);

  const onChange = (newActInfo: any, save?: boolean) => {
    const newAct = { ...editableAct, ...newActInfo };
    setEditableAct(newAct);
    if (save) onSaveChanges(newAct);
  };

  const onSaveChanges = (newAct = {}) => {
    if (!editableAct || isUpdatingAct) {
      return;
    }

    // TODO: Send along question type id and answer type id
    actUpdate({
      variables: {
        input: {
          id: editableAct.id,
          question: editableAct.question,
          answer: editableAct.answer,
          instruction: editableAct.instruction,
        },
      },
      onCompleted: (data) => {
        console.log("data", data);
      },
      onError: (error: Error) => {
        alert.show(error.message);
      },
    });
  };

  return (
    <Monitor>
      <MonitorScreenContainer>
        <MonitorScreen>
          {!!data && (
            <>
              <EditableQuestion
                instruction={editableAct?.instruction || ""}
                question={editableAct?.question}
                questionType={editableAct?.questionType.slug}
                onChange={onChange}
                onSaveChanges={onSaveChanges}
              />
              <EditableAnswer
                answer={editableAct?.answer || ""}
                answerType={editableAct?.answerType.slug}
                onChange={onChange}
                onSaveChanges={onSaveChanges}
              />
            </>
          )}
        </MonitorScreen>
      </MonitorScreenContainer>
    </Monitor>
  );
};

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

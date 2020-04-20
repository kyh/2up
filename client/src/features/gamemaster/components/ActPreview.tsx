import React, { useState, useEffect } from "react";
import styled from "styled-components";

import { EditableQuestion } from "features/game/components/Question";
import { EditableAnswer } from "features/game/components/Answer";
import { Act } from "features/gamemaster/PackCreatorPage";

import monitor from "./monitor.svg";

type Props = {
  selectedAct?: Act;
  onUpdateAct: (_act: Act) => void;
};

export const ActPreview: React.FC<Props> = ({ selectedAct, onUpdateAct }) => {
  const [editableAct, setEditableAct] = useState(selectedAct);

  useEffect(() => {
    setEditableAct(selectedAct);
  }, [selectedAct]);

  const onChange = (newActInfo: Act, save?: boolean) => {
    const newAct = { ...editableAct, ...newActInfo };
    setEditableAct(newAct);
    if (save) onSaveChanges(newAct);
  };

  const onSaveChanges = (newAct = {}) => {
    console.log("save changes", { ...editableAct, ...newAct });
    if (editableAct) {
      onUpdateAct({ ...editableAct, ...newAct });
    }
  };

  return (
    <Monitor>
      <MonitorScreenContainer>
        <MonitorScreen>
          {!!selectedAct && (
            <>
              <EditableQuestion
                instruction={editableAct?.instruction}
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

import React from "react";
import styled from "styled-components";
import { Button, Input, Modal } from "components";
import { Act } from "features/gamemaster/PackCreatorPage";

type Props = {
  open: boolean;
  setOpen: (_isOpen: boolean) => void;
  acts: Act[];
};

export const ActsTableModal: React.FC<Props> = ({
  open = false,
  setOpen = (_isOpen: boolean) => {},
  acts = [],
}) => {
  return (
    <Modal
      open={open}
      title="Edit the pack"
      onRequestClose={() => setOpen(false)}
      maxWidth={900}
      closeButton
    >
      <ActsModalBody>
        <div className="title row">
          <div className="instruction">Instruction</div>
          <div className="question-type">Question Type</div>
          <div className="question">Question</div>
          <div className="answer">Answer Type</div>
          <div className="answer-type">Answer</div>
        </div>
        {acts.map((act: Act) => {
          return (
            <div className="row" key={act.id}>
              <div className="instruction">
                <Input defaultValue={act.instruction} />
              </div>
              <div className="question-type">{act.questionType.slug}</div>
              <div className="question">
                <Input defaultValue={act.question} />
              </div>
              <div className="answer">{act.answerType.slug}</div>
              <div className="answer-type">{act.answer}</div>
            </div>
          );
        })}
        <Button>Save</Button>
      </ActsModalBody>
    </Modal>
  );
};

const ActsModalBody = styled.form`
  min-height: 180px;

  .row {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr 1fr 1fr;

    > div {
      display: flex;
      align-items: center;
      padding: ${({ theme }) => theme.spacings(3)};
    }
  }
`;

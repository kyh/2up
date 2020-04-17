import React from "react";
import styled from "styled-components";

import { Button } from "components";
import { Act } from "features/gamemaster/PackEditPage";

type QuestionProps = {
  instruction?: string;
  question?: string;
  questionType?: string;
};

export const Question: React.FC<QuestionProps> = ({
  instruction,
  question,
  questionType,
}) => {
  switch (questionType) {
    case "image":
      return (
        <>
          <QuestionInstructions>{instruction}</QuestionInstructions>
          <QuestionImage alt={instruction} src={question} />
        </>
      );
    default:
      return (
        <>
          <QuestionInstructions>{instruction}</QuestionInstructions>
          <QuestionText>{question}</QuestionText>
        </>
      );
  }
};

export const TVQuestionConatiner = styled.div`
  max-width: 600px;
  line-height: 1.3;
  transform: translateY(-100px);
  text-align: center;
`;

const QuestionInstructions = styled.div`
  text-align: center;
  margin: 0 0 ${({ theme }) => theme.spacings(2)};
`;

const QuestionText = styled.h1`
  text-align: center;
  margin: 0 0 ${({ theme }) => theme.spacings(5)};
`;

const QuestionImage = styled.img`
  object-fit: cover;
  margin: 0 0 ${({ theme }) => theme.spacings(5)};
`;

/**
 * Editable versions of the component above for Gamemaster Pages
 */
type EditableQuestionProps = QuestionProps & {
  onChange: (_act: any, _save?: boolean) => void;
  onSaveChanges: () => void;
};

export const EditableQuestion: React.FC<EditableQuestionProps> = ({
  instruction,
  question,
  questionType,
  onChange,
  onSaveChanges,
}) => {
  switch (questionType) {
    case "image":
      return (
        <EditableQuestionContainer>
          <EditableQuestionInstructions
            value={instruction}
            onChange={(e) => onChange({ instruction: e.target.value })}
            onBlur={onSaveChanges}
          />
          <EditableQuestionImageContainer>
            <EditableType onSelectType={onChange}>
              <input
                type="text"
                value={question}
                onChange={(e) => onChange({ question: e.target.value })}
                onBlur={onSaveChanges}
              />
              <QuestionImage alt={instruction} src={question} />
            </EditableType>
          </EditableQuestionImageContainer>
        </EditableQuestionContainer>
      );
    default:
      return (
        <EditableQuestionContainer>
          <EditableQuestionInstructions
            value={instruction}
            onChange={(e) => onChange({ instruction: e.target.value })}
            onBlur={onSaveChanges}
          />
          <EditableType onSelectType={onChange}>
            <EditableQuestionText
              value={question}
              onChange={(e) => onChange({ question: e.target.value })}
              onBlur={onSaveChanges}
            />
          </EditableType>
        </EditableQuestionContainer>
      );
  }
};

const EditableType: React.FC<{
  onSelectType: (
    _act: Pick<Act, "questionType" | "question">,
    _save: boolean
  ) => void;
}> = ({ onSelectType, children }) => {
  return (
    <EditableTypeContainer>
      {children}
      <div className="button-container">
        <Button
          variant="fab"
          onClick={() => {
            onSelectType(
              {
                questionType: "text",
                question: "Hello in there?",
              },
              true
            );
          }}
        >
          T
        </Button>
        <Button
          variant="fab"
          onClick={() => {
            onSelectType(
              {
                questionType: "image",
                question:
                  "https://external-sjc3-1.xx.fbcdn.net/safe_image.php?d=AQDhZS4fRQEcCkEr&url=https%3A%2F%2Fmedia0.giphy.com%2Fmedia%2Fv1.Y2lkPTEyMGMwMTQ3YmFkYjE3NzRkOGNjOTE4Y2JkNjk0ZTg5ZDdmNWU5NDI2Y2VkMjI1NA%2FaQ0PfLFwagW52%2Fgiphy.gif&ext=gif&_nc_hash=AQD5_uuLUwC2sFcW",
              },
              true
            );
          }}
        >
          I
        </Button>
      </div>
    </EditableTypeContainer>
  );
};

const EditableTypeContainer = styled.div`
  position: relative;

  &:hover .button-container {
    display: block;
  }

  .button-container {
    display: none;
    position: absolute;
    top: 5px;
    left: 5px;
  }

  button {
    width: 30px;
    height: 30px;
    border-radius: 100%;
  }
`;

const EditableQuestionContainer = styled.div`
  input {
    border-radius: ${({ theme }) => theme.border.wavyRadius};
    border: none;
    transition: all 0.23s ease;

    &:focus {
      outline: none;
      box-shadow: 0 0 0 3px rgba(0, 0, 0, 0.3);
    }
  }
`;

const EditableQuestionInstructions = styled.input`
  text-align: center;
  margin: 0 0 ${({ theme }) => theme.spacings(2)};
`;

const EditableQuestionText = styled.input`
  text-align: center;
  margin: 0 0 ${({ theme }) => theme.spacings(5)};
  font-size: ${({ theme }) => theme.typography.h2.fontSize};
`;

const EditableQuestionImageContainer = styled.div`
  position: relative;
  input {
    position: absolute;
    left: 50%;
    top: 10px;
    transform: translateX(-50%);
  }

  img {
    width: 250px;
    height: 250px;
  }
`;

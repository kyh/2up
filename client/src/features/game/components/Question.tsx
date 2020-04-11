import React from "react";
import styled from "styled-components";
import { Button } from "components";

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
  margin: 0 0 ${({ theme }) => theme.spacings(5)};
`;

type EditableQuestionProps = QuestionProps & {
  onChange: (_act: any) => void;
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
          <EditableQuestionInstructions value={instruction} />
          <QuestionImage alt={instruction} src={question} />
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
          <EditableQuestionTextContainer>
            <EditableQuestionText
              value={question}
              onChange={(e) => onChange({ question: e.target.value })}
              onBlur={onSaveChanges}
            />
            <div className="button-container">
              <Button
                variant="fab"
                onClick={() => onChange({ questionType: "text" })}
              >
                T
              </Button>
              <Button
                variant="fab"
                onClick={() => onChange({ questionType: "image" })}
              >
                I
              </Button>
            </div>
          </EditableQuestionTextContainer>
        </EditableQuestionContainer>
      );
  }
};

const EditableQuestionContainer = styled.form`
  display: flex;
  flex-direction: column;

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

const EditableQuestionTextContainer = styled.div`
  position: relative;
  input:focus + .button-container {
    display: block;
  }

  .button-container:hover {
    display: block;
  }

  .button-container {
    display: none;
    position: absolute;
    top: -35px;
    left: 16px;
  }

  button {
    width: 30px;
    height: 30px;
    border-radius: 100%;
  }
`;

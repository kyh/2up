import { ReactNode } from "react";
import styled from "styled-components";
import { Button } from "components";

type EditableQuestionProps = {
  instruction: string;
  question: string;
  questionType: string;
  sceneId: string;
  onChange: (_updatedAct: any) => void;
};

export const EditableQuestion = ({
  sceneId,
  instruction,
  question,
  questionType,
  onChange,
}: EditableQuestionProps) => {
  switch (questionType) {
    case "image":
      return (
        <EditableQuestionContainer key={sceneId}>
          <EditableQuestionInstructions
            placeholder="Instruction..."
            defaultValue={instruction}
            onBlur={(e) => onChange({ instruction: e.target.value })}
          />
          <EditableQuestionImageContainer>
            <EditableType onSelectType={onChange}>
              <input
                type="text"
                placeholder="Image URL"
                defaultValue={question}
                onBlur={(e) => onChange({ question: e.target.value })}
              />
              <QuestionImage alt={instruction} src={question} />
            </EditableType>
          </EditableQuestionImageContainer>
        </EditableQuestionContainer>
      );
    default:
      return (
        <EditableQuestionContainer key={sceneId}>
          <EditableQuestionInstructions
            placeholder="Instruction..."
            defaultValue={instruction}
            onBlur={(e) => onChange({ instruction: e.target.value })}
          />
          <EditableType onSelectType={onChange}>
            <EditableQuestionText
              placeholder="Your question?"
              defaultValue={question}
              onBlur={(e) => onChange({ question: e.target.value })}
            />
          </EditableType>
        </EditableQuestionContainer>
      );
  }
};

type EditableTypeProps = {
  onSelectType: (_updatedScene: Pick<any, "questionType" | "question">) => void;
  children: ReactNode;
};

// TODO: Get answer types from backend
const EditableType = ({ onSelectType, children }: EditableTypeProps) => {
  return (
    <EditableTypeContainer>
      {children}
      <div className="button-container">
        <Button
          variant="fab"
          onClick={() => {
            onSelectType({
              questionType: { slug: "text" },
              question: "Hello in there?",
            });
          }}
        >
          T
        </Button>
        <Button
          variant="fab"
          onClick={() => {
            onSelectType({
              questionType: { slug: "image" },
              question: `${process.env.PUBLIC_URL}/illustrations/pusheen.gif`,
            });
          }}
        >
          I
        </Button>
      </div>
    </EditableTypeContainer>
  );
};

const QuestionImage = styled.img`
  object-fit: cover;
  margin: 0 0 ${({ theme }) => theme.spacings(5)};
`;

const EditableTypeContainer = styled.div`
  padding-top: 35px;
  position: relative;

  &:hover .button-container {
    display: block;
  }

  .button-container {
    display: none;
    position: absolute;
    top: 0;
    left: 10px;
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

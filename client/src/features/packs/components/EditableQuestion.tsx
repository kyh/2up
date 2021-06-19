import { ReactNode } from "react";
import styled from "styled-components";
import { theme } from "styles/theme";
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
            <EditableQuestionSwitch onSelectType={onChange}>
              <input
                type="text"
                placeholder="Image URL"
                defaultValue={question}
                onBlur={(e) => onChange({ question: e.target.value })}
              />
              <QuestionImage alt={instruction} src={question} />
            </EditableQuestionSwitch>
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
          <EditableQuestionSwitch onSelectType={onChange}>
            <EditableQuestionText
              placeholder="Your question?"
              defaultValue={question}
              onBlur={(e) => onChange({ question: e.target.value })}
            />
          </EditableQuestionSwitch>
        </EditableQuestionContainer>
      );
  }
};

type EditableQuestionSwitchProps = {
  onSelectType: (_updatedScene: Pick<any, "questionType" | "question">) => void;
  children: ReactNode;
};

// TODO: Get answer types from backend
const EditableQuestionSwitch = ({
  onSelectType,
  children,
}: EditableQuestionSwitchProps) => {
  return (
    <EditableQuestionSwitchContainer>
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
    </EditableQuestionSwitchContainer>
  );
};

const QuestionImage = styled.img`
  object-fit: cover;
  max-width: 100%;
  max-height: 200px;
  margin: 0 0 ${theme.spacings(5)};
  ${theme.breakpoints.desktop} {
    max-width: 500px;
  }
`;

const EditableQuestionSwitchContainer = styled.div`
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
    border-radius: ${theme.ui.borderWavyRadius};
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
  margin: 0 0 ${theme.spacings(2)};
`;

const EditableQuestionText = styled.input`
  text-align: center;
  margin: 0 0 ${theme.spacings(5)};
  font-size: 2rem;
`;

const EditableQuestionImageContainer = styled.div`
  position: relative;
  input {
    position: absolute;
    left: 50%;
    top: 10px;
    transform: translateX(-50%);
  }
`;

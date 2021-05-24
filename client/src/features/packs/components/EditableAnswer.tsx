import { useState, useEffect } from "react";
import styled from "styled-components";
import { Input, Button } from "components";
import { ScenePreviewFragment_sceneAnswers } from "./__generated__/ScenePreviewFragment";

type EditableAnswerProps = {
  sceneId: string;
  answerType: string;
  sceneAnswers: ScenePreviewFragment_sceneAnswers[];
  onChange: (_updatedScene: any) => void;
};

export const EditableAnswer = ({
  sceneId,
  sceneAnswers,
  answerType,
  onChange,
}: EditableAnswerProps) => {
  // TODO: we should move this state stuff into its own component
  const [correctAnswerIndex, setCorrectAnswerIndex] = useState(0);

  const onChangeSceneAnswer = (updatedSceneAnswer: any, index: number = 0) => {
    const updatedSceneAnswers = [...sceneAnswers];
    const original = updatedSceneAnswers[index];
    updatedSceneAnswers[index] = { ...original, ...updatedSceneAnswer };
    updatedSceneAnswers[correctAnswerIndex].isCorrect = true;
    onChange({ sceneAnswers: updatedSceneAnswers });
  };

  useEffect(() => {
    onChangeSceneAnswer({});
  }, [correctAnswerIndex]);

  switch (answerType) {
    case "multi_text":
      return (
        <EditableAnswerSwitch onSelectType={onChange} key={sceneId}>
          {sceneAnswers.map((sceneAnswer, index) => (
            <InputContainer>
              <Input
                type="radio"
                name="correct"
                value={index}
                checked={sceneAnswer?.isCorrect}
                onChange={() => setCorrectAnswerIndex(index)}
              />
              <Input
                defaultValue={sceneAnswer?.content}
                onBlur={(e) =>
                  onChangeSceneAnswer({ content: e.target.value }, index)
                }
              />
            </InputContainer>
          ))}
          <Button
            onClick={() =>
              onChange({
                sceneAnswers: [
                  ...sceneAnswers,
                  { isCorrect: false, content: "" },
                ],
              })
            }
          >
            + Add Option
          </Button>
        </EditableAnswerSwitch>
      );
    // "text"
    default:
      const [sceneAnswer] = sceneAnswers;
      return (
        <EditableAnswerSwitch onSelectType={onChange} key={sceneId}>
          <InputContainer>
            <Input
              defaultValue={sceneAnswer?.content}
              onBlur={(e) =>
                onChangeSceneAnswer({ content: e.target.value }, 0)
              }
            />
          </InputContainer>
          <Button disabled>Submit answer</Button>
        </EditableAnswerSwitch>
      );
  }
};

const InputContainer = styled.div`
  margin-bottom: ${({ theme }) => theme.spacings(3)};
`;

type EditableAnswerSwitchProps = {
  onSelectType: (
    _updatedScene: Pick<any, "answerType" | "sceneAnswers">
  ) => void;
  children: React.ReactNode;
};

// TODO: Get answer types from backend
const EditableAnswerSwitch = ({
  onSelectType,
  children,
}: EditableAnswerSwitchProps) => {
  return (
    <EditableAnswerSwitchContainer>
      {children}
      <div className="button-container">
        <Button
          variant="fab"
          onClick={() => {
            onSelectType({
              answerType: { slug: "text" },
              sceneAnswers: [],
            });
          }}
        >
          T
        </Button>
        <Button
          variant="fab"
          onClick={() => {
            onSelectType({
              answerType: { slug: "multi_text" },
              sceneAnswers: [],
            });
          }}
        >
          M
        </Button>
      </div>
    </EditableAnswerSwitchContainer>
  );
};

const EditableAnswerSwitchContainer = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  flex-direction: column;
  background: ${({ theme }) => theme.ui.background};
  padding-top: 35px;

  input {
    width: 100%;
  }

  &:hover .button-container {
    display: block;
  }

  .button-container {
    display: none;
    position: absolute;
    top: 0;
    left: 0;
    z-index: 100;

    button {
      width: 30px;
      height: 30px;
      border-radius: 100%;
    }
  }
`;

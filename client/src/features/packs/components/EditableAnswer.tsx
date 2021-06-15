import { ReactNode } from "react";
import produce from "immer";
import styled from "styled-components";
import { theme } from "styles/theme";
import { Input, SingleLetterInput, Button } from "components";
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
  const [sceneAnswer] = sceneAnswers;

  const onChangeSceneAnswer = (updatedSceneAnswer = {}, index: number = 0) => {
    onChange({
      sceneAnswers: produce(sceneAnswers, (draft) => {
        draft[index] = { ...draft[index], ...updatedSceneAnswer };
      }),
    });
  };

  switch (answerType) {
    case "multi_text":
      return (
        <EditableAnswerSwitch
          onSelectType={onChange}
          sceneId={sceneId}
          key={sceneId}
        >
          {sceneAnswers.map((sceneAnswer, index) => (
            <InputContainer key={sceneAnswer.id}>
              <Input
                type="checkbox"
                name="correct"
                value={index}
                checked={sceneAnswer.isCorrect}
                onChange={(e) =>
                  onChangeSceneAnswer({ isCorrect: e.target.checked }, index)
                }
              />
              <Input
                defaultValue={sceneAnswer.content || ""}
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
    case "text_letter":
      return (
        <EditableAnswerSwitch
          onSelectType={onChange}
          sceneId={sceneId}
          key={sceneId}
        >
          <InputContainer>
            <Input
              defaultValue={sceneAnswer?.content || ""}
              onBlur={(e) =>
                onChangeSceneAnswer({
                  content: e.target.value,
                  isCorrect: true,
                })
              }
            />
            <SingleLetterInput defaultValue={sceneAnswer?.content || ""} />
          </InputContainer>
          <Button disabled>Submit answer</Button>
        </EditableAnswerSwitch>
      );
    // "text"
    default:
      return (
        <EditableAnswerSwitch
          onSelectType={onChange}
          sceneId={sceneId}
          key={sceneId}
        >
          <InputContainer>
            <Input
              defaultValue={sceneAnswer?.content || ""}
              onBlur={(e) =>
                onChangeSceneAnswer({
                  content: e.target.value,
                  isCorrect: true,
                })
              }
            />
          </InputContainer>
          <Button disabled>Submit answer</Button>
        </EditableAnswerSwitch>
      );
  }
};

const InputContainer = styled.div`
  margin-bottom: ${theme.spacings(3)};
`;

type EditableAnswerSwitchProps = {
  onSelectType: (
    _updatedScene: Pick<any, "answerType" | "sceneAnswers">
  ) => void;
  sceneId: string;
  children: ReactNode;
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
        <Button
          variant="fab"
          onClick={() => {
            onSelectType({
              answerType: { slug: "text_letter" },
              sceneAnswers: [],
            });
          }}
        >
          L
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
  background: ${theme.ui.background};

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
    button {
      width: 30px;
      height: 30px;
      border-radius: 100%;
    }
  }
`;

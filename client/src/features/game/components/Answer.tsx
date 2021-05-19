import { useState, useEffect, ReactNode } from "react";
import styled from "styled-components";
// import CanvasDraw from "react-canvas-draw";
// import { HexColorPicker } from "react-colorful";
import { Input, Button } from "components";
import type { SceneAnswer } from "features/game/gameSlice";

type AnswerProps = {
  sceneAnswer?: SceneAnswer;
  answerType?: string;
  submitted?: boolean;
  onSubmit?: (_value: any) => void;
  displayMode?: boolean;
};

export const Answer = ({
  sceneAnswer = {},
  answerType = "text",
  submitted = false,
  onSubmit = () => {},
  displayMode = false,
}: AnswerProps) => {
  switch (answerType) {
    case "multi_text":
      return (
        <AnswerMulti
          sceneAnswer={sceneAnswer}
          submitted={submitted}
          onSubmit={onSubmit}
          displayMode={displayMode}
        />
      );
    // "text"
    default:
      return (
        <AnswerText
          sceneAnswer={sceneAnswer}
          submitted={submitted}
          onSubmit={onSubmit}
          displayMode={displayMode}
        />
      );
  }
};

const AnswerText = ({
  sceneAnswer = {},
  submitted = false,
  onSubmit = () => {},
  displayMode = false,
}: AnswerProps) => {
  const [value, setValue] = useState("");
  const submit = (e: React.SyntheticEvent) => {
    e.preventDefault();
    onSubmit(value);
  };

  if (displayMode) {
    return <AnswerTextDisplay>{sceneAnswer?.content}</AnswerTextDisplay>;
  }

  return (
    <AnswerTextForm onSubmit={submit}>
      <InputContainer>
        <Input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          readOnly={submitted}
          autoFocus
          fullWidth
        />
      </InputContainer>
      <Button type="submit" disabled={!value || submitted}>
        Submit answer
      </Button>
    </AnswerTextForm>
  );
};

const AnswerTextForm = styled.form`
  text-align: center;
  width: 100%;
`;

const InputContainer = styled.div`
  margin-bottom: ${({ theme }) => theme.spacings(3)};
`;

const AnswerTextDisplay = styled.div`
  ${({ theme }) => theme.typography.h3};
  text-align: center;
  padding: ${({ theme }) => theme.spacings(3)};
  border: 2px solid ${({ theme }) => theme.border.alternateColor};
  border-radius: ${({ theme }) => theme.border.wavyRadius};
`;

const AnswerMulti = ({
  sceneAnswer = {},
  submitted = false,
  onSubmit = () => {},
  displayMode = false,
}: AnswerProps) => {
  if (displayMode) {
    return (
      <Button key={sceneAnswer?.id} fullWidth disabled>
        {sceneAnswer?.content}
      </Button>
    );
  }

  return (
    <Button
      key={sceneAnswer?.id}
      disabled={submitted}
      onClick={() => onSubmit(sceneAnswer)}
      fullWidth
    >
      {sceneAnswer?.content}
    </Button>
  );
};

// const AnswerCanvas: React.FC<
//   AnswerProps & { height?: number; width?: number }
// > = ({ submitted = false, onSubmit = () => {}, width, height }) => {
//   const canvas = createRef<CanvasDraw>();

//   const handleClick = () => {
//     const data = canvas?.current?.getSaveData();
//     onSubmit(data);
//   };

//   return (
//     <Box textAlign="center">
//       <Box mb={3}>
//         <CanvasDraw
//           ref={canvas}
//           brushRadius={5}
//           lazyRadius={5}
//           canvasWidth={width || window.innerWidth}
//           canvasHeight={height || window.innerHeight - 250}
//         />
//       </Box>
//       <Button disabled={submitted} onClick={handleClick}>
//         Submit answer
//       </Button>
//     </Box>
//   );
// };

// const AnswerColor: React.FC<AnswerProps> = ({
//   submitted = false,
//   onSubmit = () => {},
// }) => {
//   const [color, setColor] = useState("#ffffff");

//   const handleClick = () => {
//     onSubmit(color);
//   };

//   return (
//     <ColorPickerContainer>
//       <HexColorPicker color={color} onChange={setColor} />
//       <Button disabled={!color || submitted} onClick={handleClick}>
//         Submit answer
//       </Button>
//     </ColorPickerContainer>
//   );
// };

// const ColorPickerContainer = styled.div`
//   .react-colorful {
//     margin-bottom: ${({ theme }) => theme.spacings(2)};
//   }
// `;

// const HexColor = styled.div<{ hex?: string }>`
//   width: 30px;
//   height: 30px;
//   border-radius: 30px;
//   background-color: ${(props) => props.hex ?? "transparent"};
//   margin: 0 auto;
// `;

/**
 * Editable versions of the component above for Gamemaster Pages
 */
type EditableAnswerProps = {
  sceneId: string;
  answerType: string;
  sceneAnswers: SceneAnswer[];
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

  const onChangeSceneAnswer = (
    updatedSceneAnswer: SceneAnswer = {},
    index: number = 0
  ) => {
    const updatedSceneAnswers = [...sceneAnswers];
    const original = updatedSceneAnswers[index];
    updatedSceneAnswers[index] = { ...original, ...updatedSceneAnswer };
    updatedSceneAnswers[correctAnswerIndex].isCorrect = true;
    onChange({ sceneAnswers: updatedSceneAnswers });
  };

  useEffect(() => {
    onChangeSceneAnswer();
  }, [correctAnswerIndex]);

  switch (answerType) {
    case "multi_text":
      return (
        <EditableType onSelectType={onChange} key={sceneId}>
          {sceneAnswers.map((_, index) => (
            <InputContainer>
              <Input
                type="radio"
                name="correct"
                value={index}
                onChange={() => setCorrectAnswerIndex(index)}
              />
              <Input
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
        </EditableType>
      );
    // "text"
    default:
      const [sceneAnswer] = sceneAnswers;
      return (
        <EditableType onSelectType={onChange} key={sceneId}>
          <InputContainer>
            <Input
              defaultValue={sceneAnswer.content}
              onBlur={(e) =>
                onChangeSceneAnswer({ content: e.target.value }, 0)
              }
            />
          </InputContainer>
          <Button disabled>Submit answer</Button>
        </EditableType>
      );
  }
};

type EditableTypeProps = {
  onSelectType: (
    _updatedScene: Pick<any, "answerType" | "sceneAnswers">
  ) => void;
  children: ReactNode;
};

// TODO: Get answer types from backend
const EditableType = ({ onSelectType, children }: EditableTypeProps) => {
  return (
    <EditableAnswerContainer>
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
    </EditableAnswerContainer>
  );
};

const EditableAnswerContainer = styled.div`
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

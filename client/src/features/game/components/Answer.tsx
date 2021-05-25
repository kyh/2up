import { useState, SyntheticEvent } from "react";
import styled from "styled-components";
import { Input, Button } from "components";
import { SceneAnswer, Submission } from "features/game/gameSlice";

type AnswerProps = {
  sceneAnswer: SceneAnswer;
  answerType: string;
  submitted: boolean;
  onSubmit: (submission: Pick<Submission, "content">) => void;
  displayMode?: boolean;
};

export const Answer = ({
  sceneAnswer,
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
          answerType={answerType}
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
          answerType={answerType}
          displayMode={displayMode}
        />
      );
  }
};

const AnswerText = ({
  sceneAnswer,
  submitted,
  onSubmit,
  displayMode,
}: AnswerProps) => {
  const [value, setValue] = useState("");

  const submit = (e: SyntheticEvent) => {
    e.preventDefault();
    onSubmit({ content: value });
  };

  if (displayMode) {
    return <AnswerTextDisplay>{sceneAnswer.content}</AnswerTextDisplay>;
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
  sceneAnswer,
  submitted,
  onSubmit,
  displayMode,
}: AnswerProps) => {
  if (displayMode) {
    return (
      <Button key={sceneAnswer.id} fullWidth disabled>
        {sceneAnswer.content}
      </Button>
    );
  }

  return (
    <Button
      key={sceneAnswer.id}
      disabled={submitted}
      onClick={() => onSubmit({ content: sceneAnswer.content })}
      fullWidth
    >
      {sceneAnswer.content}
    </Button>
  );
};

// import CanvasDraw from "react-canvas-draw";
// import { HexColorPicker } from "react-colorful";

/**
<RecordContainer>
<Record onTranscribe={(value) => setValue(value)} autoStart />
</RecordContainer>

const RecordContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  opacity: 0.3;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  pointer-events: none;
  > p {
    margin: 0;
  }
`;
**/

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

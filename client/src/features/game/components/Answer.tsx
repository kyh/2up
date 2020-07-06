import React, { useState, useEffect, createRef } from "react";
import styled from "styled-components";
import { ChromePicker } from "react-color";
import CanvasDraw from "react-canvas-draw";

import { Box, Input, Button } from "components";

type AnswerProps = {
  answer?: string;
  answerType?: string;
  submitted?: boolean;
  onSubmit?: (_value: any) => void;
};

export const Answer: React.FC<AnswerProps> = ({
  answer = "",
  answerType = "text",
  submitted = false,
  onSubmit = () => {},
}) => {
  switch (answerType) {
    case "drawing":
      return <AnswerCanvas submitted={submitted} onSubmit={onSubmit} />;
    case "endorse_drawing":
      return (
        <EndorseCanvas
          answer={answer}
          submitted={submitted}
          onSubmit={onSubmit}
        />
      );
    case "color":
      return <AnswerColor submitted={submitted} onSubmit={onSubmit} />;
    case "endorse_color":
      return (
        <EndorseColor
          answer={answer}
          submitted={submitted}
          onSubmit={onSubmit}
        />
      );
    case "endorse_text":
      return (
        <EndorseText
          answer={answer}
          submitted={submitted}
          onSubmit={onSubmit}
        />
      );
    // "text"
    default:
      return (
        <AnswerText answer={answer} submitted={submitted} onSubmit={onSubmit} />
      );
  }
};

const AnswerText: React.FC<AnswerProps> = ({
  answer = "",
  submitted = false,
  onSubmit = () => {},
}) => {
  const [value, setValue] = useState("");
  const [errorValue, setErrorValue] = useState("");

  const handleClick = () => {
    if (value.toLowerCase() === answer?.toLowerCase()) {
      setErrorValue(
        "You have selected the right answer. Please write a tricky wrong answer instead."
      );
      return;
    }
    onSubmit(value);
  };

  return (
    <Box textAlign="center">
      <Input
        value={value}
        onChange={(e) => {
          setErrorValue("");
          setValue(e.target.value);
        }}
        readOnly={submitted}
      />
      <p>{errorValue}</p>
      <Button disabled={!value || submitted} onClick={handleClick}>
        Submit answer
      </Button>
    </Box>
  );
};

const EndorseText: React.FC<AnswerProps> = ({
  answer = "",
  submitted = false,
  onSubmit = () => {},
}) => {
  return (
    <EndorsementButtons disabled={submitted} onClick={() => onSubmit(answer)}>
      {answer}
    </EndorsementButtons>
  );
};

const AnswerCanvas: React.FC<AnswerProps> = ({
  submitted = false,
  onSubmit = () => {},
}) => {
  const canvas = createRef<CanvasDraw>();

  const handleClick = () => {
    const data = canvas?.current?.getSaveData();
    onSubmit(data);
  };

  return (
    <Box textAlign="center">
      <Box mb={3}>
        <CanvasDraw
          ref={canvas}
          brushRadius={5}
          lazyRadius={5}
          canvasWidth={window.innerWidth}
          canvasHeight={window.innerHeight - 250}
        />
      </Box>
      <Button disabled={submitted} onClick={handleClick}>
        Submit answer
      </Button>
    </Box>
  );
};

const EndorseCanvas: React.FC<AnswerProps> = ({
  answer = "",
  submitted = false,
  onSubmit = () => {},
}) => {
  const canvas = createRef<CanvasDraw>();

  useEffect(() => {
    canvas?.current?.loadSaveData(answer!);
  });

  return (
    <EndorsementButtons disabled={submitted} onClick={() => onSubmit(answer)}>
      <CanvasDraw
        ref={canvas}
        brushRadius={5}
        lazyRadius={5}
        canvasWidth={window.innerWidth / 4}
        canvasHeight={(window.innerHeight - 250) / 4}
      />
    </EndorsementButtons>
  );
};

const AnswerColor: React.FC<AnswerProps> = ({
  submitted = false,
  onSubmit = () => {},
}) => {
  const [color, setColor] = useState("#ffffff");

  const handleChange = (c: any) => setColor(c.hex);
  const handleClick = () => {
    onSubmit(color);
  };

  return (
    <ColorPickerContainer>
      <ChromePicker
        color={color}
        onChange={handleChange}
        onChangeComplete={handleChange}
        disableAlpha
      />
      <Button disabled={!color || submitted} onClick={handleClick}>
        Submit answer
      </Button>
    </ColorPickerContainer>
  );
};

const EndorseColor: React.FC<AnswerProps> = ({
  answer = "",
  submitted = false,
  onSubmit = () => {},
}) => {
  return (
    <EndorsementButtons disabled={submitted} onClick={() => onSubmit(answer)}>
      <HexColor hex={answer} />
    </EndorsementButtons>
  );
};

const ColorPickerContainer = styled.div`
  text-align: center;
  .chrome-picker {
    .flexbox-fix + .flexbox-fix {
      display: none !important;
    }
    margin-bottom: ${({ theme }) => theme.spacings(2)};
  }
`;

const HexColor = styled.div<{ hex?: string }>`
  width: 30px;
  height: 30px;
  border-radius: 30px;
  background-color: ${(props) => props.hex ?? "transparent"};
  margin: 0 auto;
`;

const EndorsementButtons = styled(Button)`
  display: block;
  width: 100%;
  text-transform: uppercase;
`;

/**
 * Editable versions of the component above for Gamemaster Pages
 */
type EditableAnswerProps = AnswerProps & {
  onChange: (_updatedAct: any) => void;
};

export const EditableAnswer: React.FC<EditableAnswerProps> = ({
  answer,
  answerType,
  onChange,
}) => {
  switch (answerType) {
    case "drawing":
      return (
        <EditableType onSelectType={onChange}>
          <AnswerCanvas submitted />
        </EditableType>
      );
    case "color":
      return (
        <EditableType onSelectType={onChange}>
          <AnswerColor submitted />
        </EditableType>
      );
    // "text"
    default:
      return (
        <EditableType onSelectType={onChange}>
          <Box mb={2}>
            <Input
              defaultValue={answer}
              onBlur={(e) => onChange({ answer: e.target.value })}
            />
          </Box>
          <Button disabled>Submit answer</Button>
        </EditableType>
      );
  }
};

// TODO: Get question types from backend
const EditableType: React.FC<{
  onSelectType: (_updatedAct: Pick<any, "answerType" | "answer">) => void;
}> = ({ onSelectType, children }) => {
  return (
    <EditableAnswerContainer>
      {children}
      <div className="button-container">
        <Button
          variant="fab"
          onClick={() => {
            onSelectType({
              answerType: { slug: "text" },
              answer: "",
            });
          }}
        >
          T
        </Button>
        <Button
          variant="fab"
          onClick={() => {
            onSelectType({
              answerType: { slug: "color" },
              answer: "",
            });
          }}
        >
          C
        </Button>
        <Button
          variant="fab"
          onClick={() => {
            onSelectType({
              answerType: { slug: "drawing" },
              answer: "",
            });
          }}
        >
          D
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
  border-radius: ${({ theme }) => theme.border.wavyRadius};
  border: 2px dotted ${({ theme }) => theme.colors.lightGrey};
  background: ${({ theme }) => theme.ui.background};
  padding: ${({ theme }) => theme.spacings(5)};

  &:hover .button-container {
    display: block;
  }

  .button-container {
    display: none;
    position: absolute;
    top: 10px;
    left: 10px;

    button {
      width: 30px;
      height: 30px;
      border-radius: 100%;
    }
  }
`;

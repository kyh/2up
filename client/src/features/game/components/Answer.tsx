import React, { Component, useState, useEffect, createRef } from 'react';
import styled from 'styled-components';
import { ChromePicker } from 'react-color';
import CanvasDraw from 'react-canvas-draw';
import { Box, Input, Button } from 'components';

type AnswerProps = {
  answer?: string;
  answerType?: string;
  submitted?: boolean;
  onSubmit: (_value: any) => void;
};

export const Answer: React.FC<AnswerProps> = ({
  answer,
  answerType,
  submitted,
  onSubmit
}) => {
  switch (answerType) {
    case 'drawing':
      return <AnswerCanvas submitted={submitted} onSubmit={onSubmit} />;
    case 'color':
      return <AnswerColor submitted={submitted} onSubmit={onSubmit} />;
    default:
      return (
        <AnswerText answer={answer} submitted={submitted} onSubmit={onSubmit} />
      );
  }
};

const AnswerText: React.FC<AnswerProps> = ({ answer, submitted, onSubmit }) => {
  const [value, setValue] = useState('');
  const [errorValue, setErrorValue] = useState('');

  const handleClick = () => {
    if (value.toLowerCase() === answer?.toLowerCase()) {
      setErrorValue(
        'You have selected the right answer. Please write a tricky wrong answer instead.'
      );
      return;
    }
    onSubmit(value);
  };

  return (
    <>
      <Input
        value={value}
        onChange={e => {
          setErrorValue('');
          setValue(e.target.value);
        }}
        readOnly={submitted}
      />
      <p>{errorValue}</p>
      <Button disabled={!value || submitted} onClick={handleClick}>
        Submit answer
      </Button>
    </>
  );
};

class AnswerCanvas extends Component<AnswerProps> {
  private canvas = React.createRef<CanvasDraw>();

  handleClick = () => {
    const data = this.canvas?.current?.getSaveData();
    this.props.onSubmit(data);
  };

  render() {
    return (
      <>
        <Box mb={3}>
          <CanvasDraw
            ref={this.canvas}
            brushRadius={5}
            lazyRadius={5}
            canvasWidth={window.innerWidth}
            canvasHeight={window.innerHeight - 250}
          />
        </Box>
        <Button disabled={this.props.submitted} onClick={this.handleClick}>
          Submit answer
        </Button>
      </>
    );
  }
}

const AnswerColor: React.FC<AnswerProps> = ({ submitted, onSubmit }) => {
  const [color, setColor] = useState('#ffffff');

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

const ColorPickerContainer = styled.div`
  .chrome-picker {
    .flexbox-fix + .flexbox-fix {
      display: none !important;
    }
    margin-bottom: ${({ theme }) => theme.spacings(2)};
  }
`;

const HexColor = styled.div<{hex: string}>`
  width: 30px;
  height: 30px;
  border-radius: 30px;
  background-color: ${props => (props.hex ?? 'transparent')}
`

const CanvasDisplay = ({ saveData }: { saveData: string }) => {
  const canvas = createRef<CanvasDraw>();

  useEffect(() => {
    canvas?.current?.loadSaveData(saveData);
  })

  return (
    <CanvasDraw
      ref={canvas}
      brushRadius={5}
      lazyRadius={5}
      canvasWidth={window.innerWidth / 4}
      canvasHeight={(window.innerHeight - 250) / 4}
    />
  );
}

export const renderContent = (pack: string, rawContent: string) => {
  let content: string | JSX.Element = rawContent;
  if (pack === "Color") {
    content = <HexColor hex={content} />;
  } else if (pack === "Drawing") {
    content = (
      <CanvasDisplay saveData={content} />
    );
  }

  return content;
};

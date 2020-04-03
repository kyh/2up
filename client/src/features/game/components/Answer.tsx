import React, { useState } from 'react';
import { Input, Button } from 'components';

type AnswerProps = {
  answer?: string;
  answerType?: string;
  submitted?: boolean;
  onSubmit: (_value: string) => void;
};

export const Answer: React.FC<AnswerProps> = ({
  answer,
  answerType,
  submitted,
  onSubmit
}) => {
  switch (answerType) {
    case 'drawing':
      return <AnswerCanvas />;
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

const AnswerCanvas = () => {
  return null;
};

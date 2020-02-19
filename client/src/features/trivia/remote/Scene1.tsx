import React, { useState } from 'react';
import { Flex, Input, Button } from 'components';
import { SceneProps } from 'features/trivia/triviaSlice';

export const Scene1 = ({ state, broadcast }: SceneProps) => {
  const [value, setValue] = useState('');
  const [errorValue, setErrorValue] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleClick = () => {
    if (value.toLowerCase() === state?.answer?.toLowerCase()) {
      setErrorValue(
        'You have selected the right answer. Please write a tricky wrong answer instead.'
      );
      return;
    }

    broadcast('submit', {
      name: localStorage.getItem('name'),
      submission: value
    });

    setSubmitted(true);
  };

  return (
    <Flex alignItems="center" flexDirection="column">
      <h2>{state.question}</h2>
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
    </Flex>
  );
};

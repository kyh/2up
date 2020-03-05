import React, { useState } from 'react';
import { Alert, Flex, Input, Button, Timer } from 'components';
import { SceneProps } from 'features/trivia/triviaSlice';
import { Question } from 'features/trivia/components/Question';

export const Scene1Remote = ({ state, broadcast }: SceneProps) => {
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
      <Timer initialSeconds={30} onTimeout={handleClick} />
    </Flex>
  );
};

export const Scene1TV = ({ state }: SceneProps) => {
  const submissions = state.submissions.length - 1;
  return (
    <>
      {!!submissions && (
        <Alert>{submissions} players have submitted their answers</Alert>
      )}
      <Question>{state.question}</Question>
      <Timer initialSeconds={30} />
    </>
  );
};

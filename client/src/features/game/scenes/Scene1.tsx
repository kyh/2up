import React, { useState } from 'react';
import { Alert, Flex, Input, Button, Timer } from 'components';
import { SceneProps } from 'features/game/gameSlice';
import {
  TVQuestionConatiner,
  QuestionInstructions,
  Question
} from 'features/game/components/Question';

export const Scene1Remote = ({
  state,
  broadcast,
  userId,
  name
}: SceneProps) => {
  const [value, setValue] = useState('');
  const [errorValue, setErrorValue] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const submissions = state.submissions.length - 1;
  const players = state.players.length;
  const waiting = players - submissions;

  const handleClick = () => {
    if (value.toLowerCase() === state?.answer?.toLowerCase()) {
      setErrorValue(
        'You have selected the right answer. Please write a tricky wrong answer instead.'
      );
      return;
    }

    broadcast('submit', {
      userId,
      name,
      submission: value
    });

    setSubmitted(true);
  };

  return (
    <Flex alignItems="center" flexDirection="column">
      {submitted && <Alert>Waiting for {waiting} players</Alert>}
      <QuestionInstructions>{state.instruction}</QuestionInstructions>
      <Question>{state.question}</Question>
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
      <Timer shouldCallTimeout={!submitted} onTimeout={handleClick} />
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
      <TVQuestionConatiner>
        <QuestionInstructions>{state.instruction}</QuestionInstructions>
        <Question>{state.question}</Question>
      </TVQuestionConatiner>
      <Timer />
    </>
  );
};

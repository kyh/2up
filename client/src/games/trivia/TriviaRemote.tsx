import React, { useState, useEffect } from 'react';
import { Flex, Input, Button } from 'components';
import { useTrivia } from 'games/trivia/useTrivia';

export const TriviaRemote: React.FC = () => {
  const [state, broadcast] = useTrivia();

  useEffect(() => {
    if (state.connected) {
      broadcast('game:join', {
        name: localStorage.getItem('name')
      });
    }
  }, [state.connected, broadcast]);

  switch (state.scene) {
    case 1:
      return <Scene1 broadcast={broadcast} state={state} />;
    case 2:
      return <Scene2 broadcast={broadcast} state={state} />;
    case 3:
      return <Scene3 broadcast={broadcast} state={state} />;
    default:
      return null;
  }
};

const Scene1 = ({ broadcast }: any) => {
  const [value, setValue] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleClick = () => {
    broadcast('player:submit', {
      name: localStorage.getItem('name'),
      submission: value
    });
    setSubmitted(true);
  };

  return (
    <Flex alignItems="center" flexDirection="column">
      <Input
        value={value}
        onChange={e => {
          setValue(e.target.value);
        }}
        readOnly={submitted}
      />
      <Button disabled={submitted} onClick={handleClick}>
        Submit answer
      </Button>
    </Flex>
  );
};

const Scene2 = ({ state }: any) => {
  return (
    <div>
      <h2>{state?.question}</h2>
      {state?.submissions.map((s: any) => {
        return <Button>{s.content}</Button>;
      })}
    </div>
  );
};

const Scene3 = ({ state }: any) => {
  return (
    <div>
      <h2>Your score</h2>
      <h1>3000</h1>
    </div>
  );
};

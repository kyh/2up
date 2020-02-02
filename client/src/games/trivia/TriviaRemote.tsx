import React from 'react';
import { Input, Button } from 'components';
import { useTrivia } from 'games/trivia/useTrivia';

export const TriviaRemote: React.FC = () => {
  return <Scene1 />;
};

const Scene1 = () => {
  const [state, broadcast] = useTrivia();

  const handleClick = () => {
    broadcast('broadcast', {
      message: 'player:submit',
      submission: {
        name: 'Kai',
        submission: 'Lakers'
      }
    });
  }

  return (
    <div>
      <Input />
      <Button onClick={handleClick}>Submit answer</Button>
    </div>
  );
};

const Scene2 = () => {
  return (
    <div>
      <h2>Who was the 5th president of the United States?</h2>
      <Button>George Bush</Button>
      <Button>yellowstone</Button>
      <Button>Some guy</Button>
      <Button>Rick Austin</Button>
    </div>
  );
};

const Scene3 = () => {
  return (
    <div>
      <h2>Your score</h2>
      <h1>3000</h1>
    </div>
  );
};

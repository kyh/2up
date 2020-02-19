import React from 'react';
import { Button } from 'components';
import { SceneProps } from 'features/trivia/triviaSlice';

export const Scene4 = ({ state, broadcast }: SceneProps) => {
  return (
    <div>
      <h2>Coins</h2>
      {state.players.map(player => (
        <div key={player.id}>
          <h3>{player.name}</h3>
          <h4>{player.coins}</h4>
        </div>
      ))}
      <Button onClick={() => broadcast('act:next')}>Next Question</Button>
    </div>
  );
};

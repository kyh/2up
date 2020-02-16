import React from 'react';
import { SceneProps } from 'games/trivia/TriviaContext';

export const Scene4 = ({ state }: SceneProps) => {
  return (
    <div>
      <h2>Coins</h2>
      {state.players.map(player => (
        <div key={player}>
          <h3>{player}</h3>
          {/* <h4>{player.coins}</h4> */}
        </div>
      ))}
    </div>
  );
};

import React from 'react';
import { Button } from 'components';
import { SceneProps } from 'games/trivia/TriviaContext';

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
      <Button
        onClick={() =>
          broadcast('game:next', {
            gameID: state.gameID
          })
        }
      >
        Next Question
      </Button>
    </div>
  );
};

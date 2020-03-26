import React from 'react';
import { Button } from 'components';
import { SceneProps } from 'features/game/gameSlice';

export const Scene4Remote = ({ state, broadcast, name }: SceneProps) => {
  const firstPlayer = state.players[0];
  return (
    <div>
      <h2>Points</h2>
      {state.players.map(player => (
        <div key={player.name}>
          <h3>{player.name}</h3>
          <h4>{player.score}</h4>
        </div>
      ))}
      <Button
        disabled={firstPlayer.name !== name}
        onClick={() => broadcast('act:next')}
      >
        {firstPlayer.name === name
          ? 'Next Question'
          : `Waiting for ${firstPlayer.name}`}
      </Button>
    </div>
  );
};

export const Scene4TV = ({ state }: SceneProps) => {
  return (
    <div>
      <h2>Coins</h2>
      {state.players.map(player => (
        <div key={player.id}>
          <h3>{player.name}</h3>
          <h4>{player.score}</h4>
        </div>
      ))}
    </div>
  );
};

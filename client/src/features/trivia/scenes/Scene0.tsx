import React from 'react';
import { useHistory } from 'react-router-dom';
import { Button } from 'components';
import { SceneProps } from 'features/trivia/triviaSlice';

export const Scene0Remote = ({ state, broadcast }: SceneProps) => {
  const history = useHistory();
  const handleEnd = () => {
    broadcast('end');
    history.push('/');
  };

  return (
    <div>
      <h2>Game Finished</h2>
      {state.players.map(player => (
        <div key={player.id}>
          <h3>{player.name}</h3>
          <h4>{player.coins}</h4>
        </div>
      ))}
      <Button onClick={handleEnd}>Lobby</Button>
    </div>
  );
};

export const Scene0TV = Scene0Remote;

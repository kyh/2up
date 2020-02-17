import React from 'react';
import { useHistory } from 'react-router-dom';
import { Button } from 'components';
import { SceneProps } from 'games/trivia/TriviaContext';

export const Scene0 = ({ state }: SceneProps) => {
  const history = useHistory();
  return (
    <div>
      <h2>End</h2>
      {state.players.map(player => (
        <div key={player.id}>
          <h3>{player.name}</h3>
          <h4>{player.coins}</h4>
        </div>
      ))}
      <Button onClick={() => history.push("/trivia")}>
        Lobby
      </Button>
    </div>
  );
};

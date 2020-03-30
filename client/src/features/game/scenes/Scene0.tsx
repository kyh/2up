import React from 'react';
import { useHistory } from 'react-router-dom';
import { Button } from 'components';
import { gameActions, SceneProps } from 'features/game/gameSlice';

type Props = SceneProps & {
  dispatch: (_action: object) => void;
};

export const Scene0Remote = ({ state, broadcast, dispatch }: Props) => {
  const history = useHistory();
  const handleEnd = () => {
    dispatch(gameActions.reset());
    broadcast('end');
    history.push('/');
  };

  return (
    <div>
      <h2>Game Finished</h2>
      {state.players.map(player => (
        <div key={player.name}>
          <h3>{player.name}</h3>
          <h4>{player.score}</h4>
        </div>
      ))}
      <Button onClick={handleEnd}>Lobby</Button>
    </div>
  );
};

export const Scene0TV = Scene0Remote;

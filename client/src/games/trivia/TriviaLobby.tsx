import React, { useContext, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { Flex, Box, Button } from 'components';
import { TriviaContext } from './TriviaContext';

export const TriviaLobby = () => {
  const history = useHistory();
  const { state, broadcast } = useContext(TriviaContext);

  const onClickStart = () => {
    broadcast('game:start', { gameID: state.gameID });
  };

  useEffect(() => {
    if (state.act) {
      if (localStorage.getItem('isHost') === 'true') {
        history.push('/trivia/tv');
      } else {
        history.push('/trivia/remote');
      }
    }
  }, [state.act, history]);

  return (
    <Flex alignItems="center" flexDirection="column">
      <h1>Waiting for players to join...</h1>
      <Box>Game ID: {state.gameID}</Box>
      <Box>
        {state.players.map(p => {
          return <div key={p.name}>{p.name}</div>;
        })}
      </Box>
      <Button onClick={onClickStart}>Start game</Button>
    </Flex>
  );
};

import React, { useContext } from 'react';
import { Flex, Box, Button } from 'components';
import { TriviaContext } from './TriviaContext';

export const TriviaLobby = () => {
  const { state, broadcast } = useContext(TriviaContext);

  const onClickStart = () => {
    broadcast('game:start', { gameID: state.gameID });
  };

  return (
    <Flex alignItems="center" flexDirection="column">
      <h1>Waiting for players to join...</h1>
      <Box>
        {state.players.map(p => {
          return <span>{p.name}</span>;
        })}
      </Box>
      <Button onClick={onClickStart}>Start game</Button>
    </Flex>
  );
};

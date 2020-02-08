import React, { useState, useContext, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { SoundMap } from 'styles/sounds';
import { Flex, Box, Button, Input } from 'components';
import { TriviaContext } from './TriviaContext';

export const TriviaIntro = () => {
  const history = useHistory();
  const { state, broadcast } = useContext(TriviaContext);
  const [gameIDToJoin, setGameIDtoJoin] = useState('');

  const onClickHost = () => {
    const themeSong = new Audio(SoundMap.theme);
    themeSong.addEventListener('canplaythrough', () => {
      themeSong.loop = true;
      // themeSong.play();
      localStorage.setItem('isHost', 'true');
      broadcast('game:new');
    });
  };

  const onClickJoin = () => {
    localStorage.setItem('isHost', 'false');
    broadcast('game:join', {
      name: localStorage.getItem('name'),
      gameID: gameIDToJoin
    });
  };

  useEffect(() => {
    if (state.gameID) {
      history.push('/trivia/lobby');
    }
  }, [state.gameID]);

  return (
    <Flex alignItems="center" flexDirection="column">
      <Box mb={3}>
        <Button onClick={onClickHost}>Host new game</Button>
      </Box>
      <hr />
      <Flex alignItems="center" flexDirection="column" mt={3}>
        <Input
          placeholder="Game ID"
          value={gameIDToJoin}
          onChange={e => setGameIDtoJoin(e.target.value)}
        />
        <Button onClick={onClickJoin}>Join existing game</Button>
      </Flex>
    </Flex>
  );
};

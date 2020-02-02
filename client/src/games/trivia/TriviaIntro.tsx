import React, { useState, useContext } from 'react';
import { useHistory } from 'react-router-dom';
import { SoundMap } from 'styles/sounds';
import { Flex, Box, Button, Input } from 'components';
import { TriviaContext } from './TriviaContext';

export const TriviaIntro = () => {
  const history = useHistory();
  const { broadcast } = useContext(TriviaContext);

  const [gameIDToJoin, setGameIDtoJoin] = useState('');
  const [name] = useState(localStorage.getItem('name'));

  const onClickStartTv = () => {
    const themeSong = new Audio(SoundMap.theme);
    themeSong.addEventListener('canplaythrough', () => {
      themeSong.loop = true;
      // themeSong.play();
      broadcast('game:new', { name });
      history.push('/trivia/tv');
    });
  };

  const onClickStartRemote = () => {
    broadcast('game:join', { name, gameID: gameIDToJoin });
    history.push('/trivia/remote');
  };

  return (
    <Flex alignItems="center" flexDirection="column">
      <Box mb={3}>
        <Button onClick={onClickStartTv}>Start new game</Button>
      </Box>
      <hr />
      <Flex alignItems="center" flexDirection="column" mt={3}>
        <Input
          placeholder="Game ID"
          value={gameIDToJoin}
          onChange={e => setGameIDtoJoin(e.target.value)}
        />
        <Button onClick={onClickStartRemote}>Join existing game</Button>
      </Flex>
    </Flex>
  );
};

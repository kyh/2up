import React, { useState, useContext, useEffect } from 'react';
import styled from 'styled-components';
import { useHistory, useLocation } from 'react-router-dom';
import { parse } from 'query-string';
import { SoundMap } from 'styles/sounds';
import { Button, Input, Card } from 'components';
import { TriviaContext } from './TriviaContext';

const Screens = {
  join: 'join',
  name: 'name'
};

const themeSong = new Audio(SoundMap.theme);
themeSong.addEventListener('canplaythrough', () => {
  themeSong.loop = true;
});

export const TriviaIntro = () => {
  const history = useHistory();
  const location = useLocation();
  const { gameID: queryGameID } = parse(location.search);

  const { state, broadcast } = useContext(TriviaContext);
  const [shouldRedirect, setShouldRedirect] = useState(false);
  const [gameIDToJoin, setGameIDtoJoin] = useState(queryGameID || '');
  const [name, setName] = useState(localStorage.getItem('name') || '');
  const [screen, setScreen] = useState(
    queryGameID ? Screens.name : Screens.join
  );

  const onClickHost = () => {
    themeSong.play();
    localStorage.setItem('isHost', 'true');
    broadcast('game:new');
    setShouldRedirect(true);
  };

  const onClickJoin = () => {
    if (gameIDToJoin) {
      setScreen(Screens.name);
    }
  };

  const onSubmitName = () => {
    const gameID =
      typeof gameIDToJoin === 'string'
        ? gameIDToJoin.toUpperCase()
        : gameIDToJoin[0].toUpperCase();

    localStorage.setItem('isHost', 'false');
    localStorage.setItem('name', name);

    broadcast('game:join', {
      name,
      gameID
    });
    setShouldRedirect(true);
  };

  useEffect(() => {
    if (state.gameID && shouldRedirect) {
      history.push('/trivia/lobby');
    }
  }, [state.gameID, shouldRedirect, history]);

  return (
    <IntroContainer>
      <img src="/logo/logomark.svg" alt="Playhouse" />
      <IntroCard>
        {screen === Screens.name ? (
          <InputContainer>
            <Input
              placeholder="Name"
              value={name}
              onChange={e => setName(e.target.value)}
            />
            <Button onClick={onSubmitName}>Start</Button>
          </InputContainer>
        ) : (
          <>
            <InputContainer>
              <Input
                placeholder="Game ID"
                value={gameIDToJoin}
                onChange={e => setGameIDtoJoin(e.target.value)}
              />
              <Button onClick={onClickJoin}>Join existing game</Button>
            </InputContainer>
            <HostNewGameText>
              Or <button onClick={onClickHost}>host your own game</button>
            </HostNewGameText>
          </>
        )}
      </IntroCard>
    </IntroContainer>
  );
};

const IntroContainer = styled.section`
  img {
    display: block;
    width: 60px;
    margin: ${({ theme }) => `0 auto ${theme.spacings(2)}`};
  }
  transform: translateY(-70px);
`;

const IntroCard = styled(Card)`
  height: 260px;
`;

const InputContainer = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
  input {
    margin-bottom: ${({ theme }) => theme.spacings(1)};
  }
  button {
    margin-bottom: ${({ theme }) => theme.spacings(2)};
  }
`;

const HostNewGameText = styled.div`
  display: flex;
  justify-content: center;
  margin-top: auto;

  button {
    margin-left: ${({ theme }) => theme.spacings(1.2)};
    text-decoration: underline;
  }
`;

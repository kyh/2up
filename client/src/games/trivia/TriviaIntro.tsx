import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useHistory } from 'react-router-dom';
import { useQueryParams } from 'utils/queryUtils';
import { Button, Input, Card } from 'components';
import { useChannel } from 'context/Socket';

const Screens = {
  join: 'join',
  name: 'name'
};

export const TriviaIntro = () => {
  const history = useHistory();
  const { gameID: queryGameID } = useQueryParams();
  const [state, broadcast] = useChannel('playhouse', state => state.app);
  const [shouldRedirect, setShouldRedirect] = useState(false);
  const [gameIDToJoin, setGameIDtoJoin] = useState(queryGameID || '');
  const [name, setName] = useState(localStorage.getItem('name') || '');
  const [screen, setScreen] = useState(
    queryGameID ? Screens.name : Screens.join
  );

  const onClickHost = () => {
    localStorage.setItem('isHost', 'true');
    broadcast('trivia:new');
    setShouldRedirect(true);
  };

  const onClickJoin = () => {
    if (gameIDToJoin) {
      setScreen(Screens.name);
    }
  };

  const onSubmitName = () => {
    localStorage.setItem('isHost', 'false');
    localStorage.setItem('name', name);

    history.push(`/trivia/lobby?code=${gameIDToJoin}`);
  };

  useEffect(() => {
    if (state.gameID && shouldRedirect) {
      history.push(`/trivia/lobby?code=${state.gameID}`);
    }
  }, [state.gameID, shouldRedirect]);

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

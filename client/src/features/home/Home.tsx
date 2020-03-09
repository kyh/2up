import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import gql from 'graphql-tag';
import { useHistory } from 'react-router-dom';
import { useMutation, useLazyQuery } from '@apollo/react-hooks';
import { useAlert } from 'react-alert';

import { playhouseActions, usePlayhouse } from 'features/home/playhouseSlice';
import { triviaActions, useTrivia } from 'features/trivia/triviaSlice';
import { Button, Input, Card } from 'components';

const Screens = {
  join: 'join',
  name: 'name'
};

const TRIVIA_NEW = gql`
  mutation TriviaNew {
    triviaNew {
      code
    }
  }
`;

const TRIVIA_CHECK = gql`
  query TriviaCheck($code: String!) {
    game(code: $code) {
      isValid
    }
  }
`;

export const Home = () => {
  const alert = useAlert();
  const history = useHistory();
  const [triviaNew] = useMutation(TRIVIA_NEW);
  const [triviaCheck] = useLazyQuery(TRIVIA_CHECK);

  const { state: playhouseState, dispatch } = usePlayhouse();
  const { state: triviaState } = useTrivia();

  const [shouldRedirect, setShouldRedirect] = useState(false);
  const [screen, setScreen] = useState(
    triviaState.gameID ? Screens.name : Screens.join
  );
  const [gameID, setGameID] = useState(triviaState.gameID);
  const [name, setName] = useState(playhouseState.name);

  const onClickHost = async () => {
    const { data } = await triviaNew();
    if (data.error) return alert.show(data.error);
    dispatch(triviaActions.toggle_host(true));
    dispatch(triviaActions.new_game({ gameID: data.triviaNew.code }));
    setShouldRedirect(true);
  };

  const onClickJoin = async () => {
    // const { data } = await triviaCheck({ variables: { code: gameID } });
    // if (data.error) return alert.show(data.error)
    dispatch(triviaActions.new_game({ gameID }));
    setScreen(Screens.name);
  };

  const onSubmitName = () => {
    dispatch(triviaActions.toggle_host(false));
    dispatch(playhouseActions.update_user({ name }));
    setShouldRedirect(true);
  };

  useEffect(() => {
    if (triviaState.gameID && shouldRedirect) {
      history.push(`/trivia/${triviaState.gameID}/lobby`);
    }
  }, [triviaState.gameID, shouldRedirect]);

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
                type="tel"
                placeholder="Game ID"
                value={gameID}
                onChange={e => setGameID(e.target.value)}
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

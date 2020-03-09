import React, { useState, SyntheticEvent } from 'react';
import { Redirect } from 'react-router-dom';
import styled from 'styled-components';
import gql from 'graphql-tag';
import { useMutation } from '@apollo/react-hooks';
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
  mutation TriviaCheck($code: String!) {
    game(code: $code) {
      isValid
    }
  }
`;

export const Home = () => {
  const alert = useAlert();
  const [triviaNew] = useMutation(TRIVIA_NEW);
  const [triviaCheck] = useMutation(TRIVIA_CHECK);

  const { state: playhouseState, dispatch } = usePlayhouse();
  const { state: triviaState } = useTrivia();

  const [shouldRedirect, setShouldRedirect] = useState(false);
  const [screen, setScreen] = useState(
    triviaState.gameID ? Screens.name : Screens.join
  );
  const [gameID, setGameID] = useState(triviaState.gameID);
  const [name, setName] = useState(playhouseState.name);

  // Creating a new game:
  const onClickHost = async () => {
    const { data } = await triviaNew();
    if (data.error) {
      alert.show(data.error);
      return;
    }
    dispatch(triviaActions.toggle_host(true));
    dispatch(triviaActions.new_game({ gameID: data.triviaNew.code }));
    setShouldRedirect(true);
  };

  // Joining an existing game:
  const onSubmitGameCode = async (event: SyntheticEvent) => {
    event.preventDefault();
    const { data } = await triviaCheck({
      variables: { code: gameID }
    });
    if (!data.isValid || data.error) {
      alert.show('Game code does not exist');
      setGameID('');
      return;
    }
    dispatch(triviaActions.new_game({ gameID }));
    setScreen(Screens.name);
  };

  const onSubmitName = (event: SyntheticEvent) => {
    event.preventDefault();
    dispatch(triviaActions.toggle_host(false));
    dispatch(playhouseActions.update_user({ name }));
    setShouldRedirect(true);
  };

  if (triviaState.gameID && shouldRedirect) {
    return <Redirect to={`/trivia/${triviaState.gameID}/lobby`} />;
  }

  return (
    <IntroContainer>
      <img src="/logo/logomark.svg" alt="Playhouse" />
      <IntroCard>
        {screen === Screens.join ? (
          <>
            <InputContainer onSubmit={onSubmitGameCode}>
              <Input
                type="tel"
                placeholder="Game ID"
                value={gameID}
                onChange={e => setGameID(e.target.value)}
              />
              <Button>Join existing game</Button>
            </InputContainer>
            <HostNewGameText>
              Or{' '}
              <button type="button" onClick={onClickHost}>
                host your own game
              </button>
            </HostNewGameText>
          </>
        ) : (
          <InputContainer onSubmit={onSubmitName}>
            <Input
              placeholder="Name"
              value={name}
              onChange={e => setName(e.target.value)}
            />
            <Button>Start</Button>
          </InputContainer>
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

const InputContainer = styled.form`
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

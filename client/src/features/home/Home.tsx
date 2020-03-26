import React, { useState, SyntheticEvent } from 'react';
import { Redirect } from 'react-router-dom';
import styled from 'styled-components';
import gql from 'graphql-tag';
import { useMutation } from '@apollo/react-hooks';
import { useAlert } from 'react-alert';

import { playhouseActions, usePlayhouse } from 'features/home/playhouseSlice';
import { gameActions, useGame } from 'features/game/gameSlice';
import { Button, Input, Card } from 'components';

const Screens = {
  join: 'join',
  name: 'name'
};

const TRIVIA_NEW = gql`
  mutation GameNew {
    gameNew {
      code
    }
  }
`;

const TRIVIA_CHECK = gql`
  mutation GameCheck($code: String!) {
    game(code: $code) {
      isValid
    }
  }
`;

export const Home = () => {
  const alert = useAlert();
  const [gameNew] = useMutation(TRIVIA_NEW);
  const [gameCheck] = useMutation(TRIVIA_CHECK);

  const { state: playhouseState, dispatch } = usePlayhouse();
  const { state: gameState } = useGame();

  const [shouldRedirect, setShouldRedirect] = useState(false);
  const [screen, setScreen] = useState(
    gameState.gameId ? Screens.name : Screens.join
  );
  const [gameId, setgameId] = useState(gameState.gameId);
  const [name, setName] = useState(playhouseState.name);

  // Creating a new game:
  const onClickHost = async () => {
    const { data } = await gameNew();
    if (data.error) {
      alert.show(data.error);
      return;
    }
    dispatch(gameActions.toggle_host(true));
    dispatch(gameActions.new_game({ gameId: data.gameNew.code }));
    setShouldRedirect(true);
  };

  // Joining an existing game:
  const onSubmitGameCode = async (event: SyntheticEvent) => {
    event.preventDefault();
    const { data } = await gameCheck({
      variables: { code: gameId }
    });
    if (data.error || (data && !data.game.isValid)) {
      alert.show('Game code does not exist');
      setgameId('');
      return;
    }
    dispatch(gameActions.new_game({ gameId }));
    setScreen(Screens.name);
  };

  const onSubmitName = (event: SyntheticEvent) => {
    event.preventDefault();
    dispatch(gameActions.toggle_host(false));
    dispatch(playhouseActions.update_user({ name }));
    setShouldRedirect(true);
  };

  if (gameState.gameId && shouldRedirect) {
    return <Redirect to={`/game/${gameState.gameId}/lobby`} />;
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
                value={gameId}
                onChange={e => setgameId(e.target.value)}
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
            <Button disabled={!name}>Start</Button>
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

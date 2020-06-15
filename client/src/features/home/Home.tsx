import React, { useState, SyntheticEvent } from "react";
import { Link, Redirect } from "react-router-dom";
import { useMutation } from "@apollo/react-hooks";
import { gql } from "apollo-boost";
import styled from "styled-components";
import { useAlert } from "react-alert";

import { playhouseActions, usePlayhouse } from "features/home/playhouseSlice";
import { gameActions, useGame } from "features/game/gameSlice";
import { Navigation, PageContainer, Button, Input, Card } from "components";

import { HomeGameCheckMutation } from "./__generated__/HomeGameCheckMutation";

const Screens = {
  join: "join",
  name: "name",
};

const GAME_CHECK = gql`
  mutation HomeGameCheckMutation($input: GameInput!) {
    game(input: $input) {
      isValid
    }
  }
`;

export const Home = () => {
  const alert = useAlert();

  const { state: playhouseState, dispatch } = usePlayhouse();
  const { state: gameState } = useGame();

  const [shouldRedirect, setShouldRedirect] = useState(false);
  const [screen, setScreen] = useState(
    gameState.gameId ? Screens.name : Screens.join
  );
  const [gameId, setgameId] = useState(gameState.gameId);
  const [name, setName] = useState(playhouseState.name);
  const [gameCheck] = useMutation<HomeGameCheckMutation>(GAME_CHECK);

  // Joining an existing game:
  const onSubmitGameCode = async (event: SyntheticEvent) => {
    event.preventDefault();

    const { data } = await gameCheck({
      variables: { input: { code: gameId } },
    });

    if (data?.game?.isValid) {
      dispatch(gameActions.new_game({ gameId }));
      setScreen(Screens.name);
      return;
    }

    alert.show("Game code does not exist");
    setgameId("");
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
    <>
      <Navigation />
      <PageContainer size="large" align="center">
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
                    onChange={(e) => setgameId(e.target.value)}
                  />
                  <Button type="submit">Join existing game</Button>
                </InputContainer>
                <HostNewGameText>
                  Or <Link to="/gamemaster">host your own game</Link>
                </HostNewGameText>
              </>
            ) : (
              <InputContainer onSubmit={onSubmitName}>
                <Input
                  placeholder="Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
                <Button type="submit" disabled={!name}>
                  Start
                </Button>
              </InputContainer>
            )}
          </IntroCard>
        </IntroContainer>
      </PageContainer>
    </>
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

  a {
    margin-left: ${({ theme }) => theme.spacings(1.2)};
    text-decoration: underline;
  }
`;

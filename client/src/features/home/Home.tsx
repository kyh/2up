import React, { useState, SyntheticEvent } from "react";
import { Redirect } from "react-router-dom";
import graphql from "babel-plugin-relay/macro";
import styled from "styled-components";
import { useAlert } from "react-alert";

import { useMutation } from "utils/useMutation";
import { playhouseActions, usePlayhouse } from "features/home/playhouseSlice";
import { gameActions, useGame } from "features/game/gameSlice";
import { Button, Input, Card } from "components";
import { PackModal } from "features/home/PackModal";

<<<<<<< HEAD
import { HomeGameNewMutation } from "./__generated__/HomeGameNewMutation.graphql";
import { HomeGameCheckMutation } from "./__generated__/HomeGameCheckMutation.graphql";
=======
import { HomeGameCreateMutation } from './__generated__/HomeGameCreateMutation.graphql';
import { HomeGameCheckMutation } from './__generated__/HomeGameCheckMutation.graphql';
>>>>>>> Initial skeletons of dashboard

const Screens = {
  join: "join",
  name: "name",
};

const GameCheckMutation = graphql`
  mutation HomeGameCheckMutation($input: GameInput!) {
    game(input: $input) {
      isValid
    }
  }
`;

const GameCreateMutation = graphql`
  mutation HomeGameCreateMutation($input: GameCreateInput!) {
    gameCreate(input: $input) {
      code
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
  const [isPackModalOpen, setIsPackModalOpen] = useState(false);

<<<<<<< HEAD
  const [gameCheck, isCheckingGame] = useMutation<HomeGameCheckMutation>(
    GameCheck
  );
  const [gameNew, isCreatingGame] = useMutation<HomeGameNewMutation>(GameNew);
=======
  const gameCheck = useBaseMutation<HomeGameCheckMutation>(GameCheckMutation);
  const gameCreate = useBaseMutation<HomeGameCreateMutation>(GameCreateMutation);
>>>>>>> Initial skeletons of dashboard

  const onClickHost = () => {
    setIsPackModalOpen(true);
  };

  // Joining an existing game:
  const onSubmitGameCode = async (event: SyntheticEvent) => {
    event.preventDefault();

    gameCheck({
      variables: { input: { code: gameId } },
      onCompleted: (data) => {
        if (!data.game?.isValid) {
          alert.show("Game code does not exist");
          setgameId("");
          return;
        }
        dispatch(gameActions.new_game({ gameId }));
        setScreen(Screens.name);
      },
      onError: (error: Error) => {
        alert.show(error);
      },
    });
  };

  const onSubmitName = (event: SyntheticEvent) => {
    event.preventDefault();
    dispatch(gameActions.toggle_host(false));
    dispatch(playhouseActions.update_user({ name }));
    setShouldRedirect(true);
  };

  // Creating a new game:
  const onSelectPack = (pack: string) => {
    gameCreate({
      variables: { input: { pack } },
      onCompleted: (data) => {
        if (!data || !data.gameCreate) {
          return;
        }
        dispatch(gameActions.toggle_host(true));
        dispatch(playhouseActions.update_user({ name: "" }));
        dispatch(gameActions.new_game({ gameId: data.gameCreate.code }));
        setShouldRedirect(true);
      },
      onError: (error: Error) => {
        alert.show(error);
      },
    });
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
                onChange={(e) => setgameId(e.target.value)}
              />
              <Button type="submit" disabled={isCheckingGame}>
                Join existing game
              </Button>
            </InputContainer>
            <HostNewGameText>
              Or{" "}
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
              onChange={(e) => setName(e.target.value)}
            />
            <Button type="submit" disabled={!name}>
              Start
            </Button>
          </InputContainer>
        )}
      </IntroCard>
      <React.Suspense fallback="">
        <PackModal
          isLoading={isCreatingGame}
          isPackModalOpen={isPackModalOpen}
          setIsPackModalOpen={setIsPackModalOpen}
          onSelectPack={onSelectPack}
        />
      </React.Suspense>
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

import { useState, SyntheticEvent } from "react";
import { Link, useHistory } from "react-router-dom";
import styled from "styled-components";
import { gql, useMutation } from "@apollo/client";
import { useAlert } from "react-alert";
import { gameActions, useGame } from "features/game/gameSlice";
import { Button, Input } from "components";
import { Form } from "features/home/components/Form";
import { HomeGameCheckMutation } from "./__generated__/HomeGameCheckMutation";

const GAME_CHECK = gql`
  mutation HomeGameCheckMutation($input: GameInput!) {
    game(input: $input) {
      isValid
    }
  }
`;

export const HomeJoinGamePage = () => {
  const alert = useAlert();
  const history = useHistory();
  const { state: gameState, dispatch } = useGame();
  const [gameId, setGameId] = useState(gameState.gameId);
  const [gameCheck] = useMutation<HomeGameCheckMutation>(GAME_CHECK);

  // Joining an existing game:
  const onSubmitGameCode = async (event: SyntheticEvent) => {
    event.preventDefault();

    const { data } = await gameCheck({
      variables: { input: { code: gameId } },
    });

    if (data?.game?.isValid) {
      dispatch(gameActions.new_game({ gameId }));
      history.push("/join");
    } else {
      alert.show("Game code does not exist");
      setGameId("");
    }
  };

  return (
    <>
      <Form onSubmit={onSubmitGameCode}>
        <Input
          type="tel"
          placeholder="Game ID"
          value={gameId}
          onChange={(e) => setGameId(e.target.value)}
        />
        <Button type="submit">Join existing game</Button>
      </Form>
      <StartNewGameText>
        Or <Link to="/packs">start your own game</Link>
      </StartNewGameText>
    </>
  );
};

export const StartNewGameText = styled.div`
  display: flex;
  justify-content: center;
  margin-top: auto;

  a {
    margin-left: ${({ theme }) => theme.spacings(1.2)};
    text-decoration: underline;
  }
`;

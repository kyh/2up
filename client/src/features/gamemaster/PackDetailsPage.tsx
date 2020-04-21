import React from "react";
import styled from "styled-components";
import { Link, useParams, useHistory } from "react-router-dom";
import graphql from "babel-plugin-relay/macro";
import { useAlert } from "react-alert";

import { playhouseActions, usePlayhouse } from "features/home/playhouseSlice";
import { gameActions } from "features/game/gameSlice";
import { Box, Card, Button } from "components";
import { useMutation } from "utils/useMutation";

import { PackDetailsPageGameCreateMutation } from "./__generated__/PackDetailsPageGameCreateMutation.graphql";
import { Navigation } from "./components/Navigation";

const GameCreateMutation = graphql`
  mutation PackDetailsPageGameCreateMutation($input: GameCreateInput!) {
    gameCreate(input: $input) {
      code
    }
  }
`;

export const PackDetailsPage = () => {
  const { packId } = useParams();
  const history = useHistory();
  const alert = useAlert();
  const { dispatch } = usePlayhouse();

  const [gameCreate, isCreatingGame] = useMutation<
    PackDetailsPageGameCreateMutation
  >(GameCreateMutation);

  const onHostGame = () => {
    gameCreate({
      variables: { input: { pack: packId! } },
      onCompleted: (data) => {
        if (!data || !data.gameCreate) return;
        const gameId = data.gameCreate.code;
        dispatch(gameActions.toggle_host(true));
        dispatch(playhouseActions.update_user({ name: "" }));
        dispatch(gameActions.new_game({ gameId }));
        history.push(`/game/${gameId}/lobby`);
      },
      onError: (error: Error) => {
        alert.show(error.message);
      },
    });
  };

  return (
    <Page>
      <Navigation />
      <Content>
        <Box mr={5}>
          <Box mb={3}>
            <Link to="/gamemaster">&#171; Back to packs</Link>
          </Box>
          <h1>Pack Name</h1>
          <p>
            A guided tour through our most beautiful and delightful puzzles.
          </p>
        </Box>
        <GameCard>
          <img src="https://ds055uzetaobb.cloudfront.net/brioche/chapter/Logic_1_by_1_white-wRqCbD.png?width=320" />
          <Button onClick={onHostGame} disabled={isCreatingGame}>
            Host a game
          </Button>
          <Link to={`/gamemaster/${packId}/edit`}>Edit Pack</Link>
        </GameCard>
      </Content>
    </Page>
  );
};

const Page = styled.section`
  display: grid;
  height: calc((var(--vh, 1vh) * 100));
  background: ${({ theme }) => theme.ui.backgroundGrey};
  grid-template-areas:
    "header  header  header"
    "content content content"
    "footer  footer  footer";
  grid-template-columns: 1fr 1fr 1fr;
  grid-template-rows: 50px 1fr 50px;
`;

const Content = styled.section`
  display: flex;
  max-width: 900px;
  margin: 0 auto;
  grid-area: content;
  padding: ${({ theme }) => `${theme.spacings(10)} ${theme.spacings(5)}`};
`;

const GameCard = styled(Card)`
  height: max-content;
  width: 35%;
  align-items: center;

  img {
    display: block;
    width: 160px;
    height: 160px;
    object-fit: cover;
    margin: ${({ theme }) => `0 auto ${theme.spacings(2)}`};
  }

  button {
    width: 100%;
    margin-bottom: ${({ theme }) => theme.spacings(2)};
  }
`;

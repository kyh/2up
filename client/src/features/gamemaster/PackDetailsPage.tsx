import React from "react";
import styled from "styled-components";
import { Link, useParams, useHistory } from "react-router-dom";
import gql from "graphql-tag";
import { useQuery, useMutation } from "@apollo/react-hooks";

import { playhouseActions, usePlayhouse } from "features/home/playhouseSlice";
import { gameActions } from "features/game/gameSlice";
import { DefaultImage } from "features/gamemaster/PackDiscoverPage";
import { Card, Button } from "components";

import { Navigation } from "./components/Navigation";
import { Page, Content } from "./components/Page";

import { PackDetailsPageGameCreateMutation } from "./__generated__/PackDetailsPageGameCreateMutation";
import { PackDetailsPagePackQuery } from "./__generated__/PackDetailsPagePackQuery";

const GAME_CREATE = gql`
  mutation PackDetailsPageGameCreateMutation($input: GameCreateInput!) {
    gameCreate(input: $input) {
      code
    }
  }
`;

const PACK_QUERY = gql`
  query PackDetailsPagePackQuery($packId: ID!) {
    currentUser {
      id
    }
    pack(id: $packId) {
      id
      name
      description
      imageUrl
      user {
        id
      }
    }
  }
`;

export const PackDetailsPage = () => {
  const { packId } = useParams();
  const history = useHistory();
  const { dispatch } = usePlayhouse();

  const [gameCreate] = useMutation<PackDetailsPageGameCreateMutation>(
    GAME_CREATE
  );
  const { data } = useQuery<PackDetailsPagePackQuery>(PACK_QUERY, {
    variables: { packId },
  });

  const { pack, currentUser } = data || {};

  const onHostGame = async () => {
    const { data } = await gameCreate({
      variables: { input: { packId: packId || "" } },
    });

    if (!data || !data.gameCreate) return;
    const gameId = data.gameCreate.code;
    dispatch(gameActions.toggle_host(true));
    dispatch(playhouseActions.update_user({ name: "" }));
    dispatch(gameActions.new_game({ gameId }));
    history.push(`/game/${gameId}/lobby`);
  };

  return (
    <Page>
      <Navigation />
      <PackDetailsPageContent>
        <Link className="back-link" to="/gamemaster">
          &#171; Back to packs
        </Link>
        <div className="pack-details">
          <GameCard>
            {pack?.imageUrl ? (
              <img src={pack?.imageUrl || ""} alt={pack?.name} />
            ) : (
              <DefaultImage />
            )}
            <Button onClick={onHostGame}>Host a game</Button>
            {pack?.user?.id === currentUser?.id && (
              <Link to={`/gamemaster/${packId}/edit`}>Edit Pack</Link>
            )}
          </GameCard>
          <div className="description-container">
            <h1 className="pack-name">{pack?.name}</h1>
            <p className="pack-description">{pack?.description}</p>
          </div>
        </div>
      </PackDetailsPageContent>
    </Page>
  );
};

const PackDetailsPageContent = styled(Content)`
  display: block;

  .back-link {
    display: inline-block;
    margin-bottom: ${({ theme }) => theme.spacings(3)};
  }

  .pack-details {
    display: flex;
    justify-content: space-between;
    flex-direction: row-reverse;

    ${({ theme }) => theme.media.desktop`
      display: block;
    `}
  }

  .description-container {
    padding-right: ${({ theme }) => theme.spacings(10)};
  }
`;

const GameCard = styled(Card)`
  height: max-content;
  min-width: 250px;
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

  ${({ theme }) => theme.media.desktop`
    margin-bottom: ${theme.spacings(5)};
  `}
`;

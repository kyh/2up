import React from "react";
import styled from "styled-components";
import { Link, useParams } from "react-router-dom";
import { gql, useQuery } from "@apollo/client";

import { useHostGame } from "features/game/gameService";

import { PackImage } from "features/packs/components/Packs";
import { Card, Button } from "components";

import { Navigation } from "./components/Navigation";
import { Page, Content } from "./components/Page";

import { PackDetailsPagePackQuery } from "./__generated__/PackDetailsPagePackQuery";

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
  const { packId } = useParams<{ packId: string }>();
  const hostGame = useHostGame();

  const { data } = useQuery<PackDetailsPagePackQuery>(PACK_QUERY, {
    variables: { packId },
  });

  const { pack, currentUser } = data || {};

  return (
    <Page>
      <Navigation />
      <PackDetailsPageContent>
        <Link to="/packs" className="back-link">
          &#171; Back to packs
        </Link>
        <div className="pack-details">
          <GameCard>
            <PackImage src={pack?.imageUrl} />
            <Button onClick={() => hostGame(packId)}>Host a game</Button>
            {!!data && pack?.user?.id === currentUser?.id && (
              <Link to={`/packs/${packId}/edit`}>Edit Pack</Link>
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
    &:hover {
      text-decoration: underline;
    }
  }

  .pack-details {
    justify-content: space-between;
    flex-direction: row-reverse;

    ${({ theme }) => theme.media.desktop`
      display: flex;
    `}
  }

  .description-container {
    ${({ theme }) => theme.media.desktop`
      padding-right: ${theme.spacings(10)};
    `}
  }
`;

const GameCard = styled(Card)`
  height: max-content;
  min-width: 250px;
  align-items: center;
  margin-bottom: ${({ theme }) => theme.spacings(5)};

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

  a:hover {
    text-decoration: underline;
  }
`;

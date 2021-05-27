import styled from "styled-components";
import { Link, useParams } from "react-router-dom";
import { gql, useQuery } from "@apollo/client";
import { theme } from "styles/theme";
import { Button } from "components";
import { useHostGame } from "features/game/gameService";
import { Navigation } from "./components/Navigation";
import { Page, Content } from "./components/Page";
import { PackDetailsPagePackQuery } from "./__generated__/PackDetailsPagePackQuery";

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
        {pack && (
          <header className="pack-header">
            <h1 className="pack-name">{pack.name}</h1>
            <p className="pack-description">{pack.description}</p>
            <div className="pack-actions">
              <Button onClick={() => hostGame(packId)}>Start a game</Button>
              {!!data && pack.user.id === currentUser?.id && (
                <Link to={`/packs/${packId}/edit`}>Edit Pack</Link>
              )}
            </div>
          </header>
        )}
      </PackDetailsPageContent>
    </Page>
  );
};

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

const PackDetailsPageContent = styled(Content)`
  display: block;

  .back-link {
    display: inline-block;
    margin-bottom: ${theme.spacings(5)};
    &:hover {
      text-decoration: underline;
    }
  }

  .pack-header {
    text-align: center;
    margin: auto;
    max-width: 600px;
  }

  .pack-description {
    margin-bottom: ${theme.spacings(5)};
  }

  .pack-actions {
    display: flex;
    flex-direction: column;
    align-items: center;

    button {
      margin-bottom: ${theme.spacings(2)};
      min-width: 150px;
    }

    a:hover {
      text-decoration: underline;
    }
  }
`;

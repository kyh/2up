import { SEO } from "components";
import { PageContainer } from "features/home/components/Page";
import { GameLayout } from "features/game/GameLayout";
import { GameLobby } from "features/game/GameLobby";

const GameLobbyPage = () => {
  return (
    <>
      <SEO title="Game Lobby" />
      <PageContainer justify="start">
        <GameLobby />
      </PageContainer>
    </>
  );
};

GameLobbyPage.Layout = GameLayout;

export default GameLobbyPage;

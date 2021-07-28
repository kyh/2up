import { SEO } from "components";
import { PageContainer } from "features/home/components/Page";
import { GameLayout } from "features/game/GameLayout";
import { GameLobby } from "features/game/GameLobby";

const GameLobbySpectatePage = () => {
  return (
    <>
      <SEO title="Spectate Game" />
      <PageContainer justify="start">
        <GameLobby isSpectate />
      </PageContainer>
    </>
  );
};

GameLobbySpectatePage.Layout = GameLayout;

export default GameLobbySpectatePage;

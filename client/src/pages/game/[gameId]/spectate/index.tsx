import { SEO } from "components";
import { PageContainer } from "features/home/components/Page";
import { GameLayout } from "features/game/GameLayout";
import { Game } from "features/game/Game";

const GameSpectatePage = () => {
  return (
    <>
      <SEO title="Spectate Game" />
      <PageContainer justify="start">
        <Game isSpectate />
      </PageContainer>
    </>
  );
};

GameSpectatePage.Layout = GameLayout;

export default GameSpectatePage;

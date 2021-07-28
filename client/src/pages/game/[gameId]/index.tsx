import { SEO } from "components";
import { PageContainer } from "features/home/components/Page";
import { GameLayout } from "features/game/GameLayout";
import { Game } from "features/game/Game";

const GamePage = () => {
  return (
    <>
      <SEO title="Game" />
      <PageContainer justify="start">
        <Game />
      </PageContainer>
    </>
  );
};

GamePage.Layout = GameLayout;

export default GamePage;

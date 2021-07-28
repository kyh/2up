import { SEO } from "components";
import { GameLayout } from "features/game/GameLayout";
import { Game } from "features/game/Game";
import { ReactNode } from "react";

const GamePage = () => {
  return (
    <>
      <SEO title="Game" />
      <Game />
    </>
  );
};

const getLayout = (page: ReactNode) => <GameLayout>{page}</GameLayout>;
GamePage.getLayout = getLayout;

export default GamePage;

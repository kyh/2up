import { ReactNode } from "react";
import { SEO } from "components";
import { GameLayout } from "lib/game/GameLayout";
import { Game } from "lib/game/Game";

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

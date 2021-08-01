import { ReactNode } from "react";
import { SEO } from "components";
import { GameLayout } from "features/game/GameLayout";
import { Game } from "features/game/Game";

const GameSpectatePage = () => {
  return (
    <>
      <SEO title="Spectate Game" />
      <Game isSpectate />
    </>
  );
};

const getLayout = (page: ReactNode) => <GameLayout>{page}</GameLayout>;

GameSpectatePage.getLayout = getLayout;

export default GameSpectatePage;

import { ReactNode } from "react";
import { SEO } from "components";
import { GameLayout } from "features/game/GameLayout";
import { GameLobby } from "features/game/GameLobby";

const GameLobbyPage = () => {
  return (
    <>
      <SEO title="Game Lobby" />
      <GameLobby />
    </>
  );
};

const getLayout = (page: ReactNode) => <GameLayout>{page}</GameLayout>;

GameLobbyPage.getLayout = getLayout;

export default GameLobbyPage;

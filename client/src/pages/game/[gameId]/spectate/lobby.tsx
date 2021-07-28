import { ReactNode } from "react";
import { SEO } from "components";
import { GameLayout } from "features/game/GameLayout";
import { GameLobby } from "features/game/GameLobby";

const GameLobbySpectatePage = () => {
  return (
    <>
      <SEO title="Spectate Game" />
      <GameLobby isSpectate />
    </>
  );
};

const getLayout = (page: ReactNode) => <GameLayout>{page}</GameLayout>;
GameLobbySpectatePage.getLayout = getLayout;

export default GameLobbySpectatePage;

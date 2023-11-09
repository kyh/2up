import { SEO } from "@/components";
import { GameLayout } from "@/lib/game/game-layout";
import { GameLobby } from "@/lib/game/game-lobby";

const GameLobbyPage = () => {
  return (
    <>
      <SEO title="Game Lobby" />
      <GameLobby />
    </>
  );
};

const getLayout = (page: React.ReactNode) => <GameLayout>{page}</GameLayout>;

GameLobbyPage.getLayout = getLayout;

export default GameLobbyPage;

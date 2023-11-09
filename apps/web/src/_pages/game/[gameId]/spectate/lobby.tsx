import { SEO } from "@/components";
import { GameLayout } from "@/lib/game/game-layout";
import { GameLobby } from "@/lib/game/game-lobby";

const GameLobbySpectatePage = () => {
  return (
    <>
      <SEO title="Spectate Game" />
      <GameLobby isSpectate />
    </>
  );
};

const getLayout = (page: React.ReactNode) => <GameLayout>{page}</GameLayout>;

GameLobbySpectatePage.getLayout = getLayout;

export default GameLobbySpectatePage;

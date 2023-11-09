import { GameLayout } from "@/lib/game/game-layout";
import { Game } from "@/lib/game/game";

const GamePage = () => {
  return <Game />;
};

const getLayout = (page: React.ReactNode) => <GameLayout>{page}</GameLayout>;

GamePage.getLayout = getLayout;

export default GamePage;

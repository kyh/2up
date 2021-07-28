import { ReactNode } from "react";
import { useRouter } from "next/router";
import { GameProvider } from "features/game/GameProvider";
import { Navigation } from "features/game/components/Navigation";

export const GameLayout = ({ children }: { children: ReactNode }) => {
  const router = useRouter();
  const { gameId } = router.query;
  return (
    <GameProvider gameId={gameId as string}>
      <Navigation />
      {children}
    </GameProvider>
  );
};

import { ReactNode } from "react";
import { useRouter } from "next/router";
import { GameProvider } from "features/game/GameProvider";
import { Navigation } from "features/game/components/Navigation";
import { PageContainer } from "features/home/components/Page";

export const GameLayout = ({ children }: { children: ReactNode }) => {
  const router = useRouter();
  const { gameId } = router.query;
  return (
    <GameProvider gameId={gameId as string}>
      <Navigation />
      <PageContainer justify="start">{children}</PageContainer>
    </GameProvider>
  );
};

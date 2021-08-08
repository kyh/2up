import styled from "styled-components";
import { ReactNode } from "react";
import { useRouter } from "next/router";
import { theme } from "styles/theme";
import { GameProvider } from "features/game/GameProvider";
import { Navigation } from "features/game/components/Navigation";

export const GameLayout = ({ children }: { children: ReactNode }) => {
  const router = useRouter();
  const { gameId } = router.query;
  return (
    <GameProvider gameId={gameId as string}>
      <Navigation />
      <GamePage>{children}</GamePage>
    </GameProvider>
  );
};

export const GamePage = styled.section`
  padding: 0 ${theme.spacings(4)};
  margin: 0 auto;
  height: 100vh;
  margin-top: -50px;
  max-width: 600px;
`;

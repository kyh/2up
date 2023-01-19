import { ReactNode } from "react";
import styled from "styled-components";
import { useRouter } from "next/router";
import { theme } from "styles/theme";
import { Navigation } from "lib/game/components/Navigation";
import { useConnectGame } from "lib/game/useConnectGame";

export const GameLayout = ({ children }: { children: ReactNode }) => {
  const router = useRouter();
  const gameId = router.query.gameId as string;

  const { isLoaded } = useConnectGame(gameId);

  if (!isLoaded) return null;

  return (
    <>
      <Navigation />
      <GamePage>{children}</GamePage>
    </>
  );
};

export const GamePage = styled.section`
  padding: 0 ${theme.spacings(4)};
  margin: 0 auto;
  height: 100vh;
  margin-top: -50px;
  max-width: 600px;
`;

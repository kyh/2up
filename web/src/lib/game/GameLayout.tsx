import { ReactNode, useEffect } from "react";
import { classed } from "@tw-classed/react";
import { useRouter } from "next/router";
import { Navigation } from "~/lib/game/components/Navigation";
import { useConnectGame } from "~/lib/game/useConnectGame";

export const GameLayout = ({ children }: { children: ReactNode }) => {
  const router = useRouter();
  const gameId = router.query.gameId as string;

  useEffect(() => {
    globalThis.document.documentElement.classList.add("overflow-hidden");
    return () =>
      globalThis.document.documentElement.classList.remove("overflow-hidden");
  }, []);

  const { isLoaded } = useConnectGame(gameId);

  if (!isLoaded) return null;

  return (
    <>
      <Navigation />
      <GamePage>{children}</GamePage>
    </>
  );
};

export const GamePage = classed.section(
  "px-4 mx-auto h-screen mt-[-50px] max-w-[600px]"
);

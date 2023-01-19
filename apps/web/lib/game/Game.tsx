import { useRouter } from "next/router";
import { useEffect } from "react";
import { useGameStore } from "lib/game/gameStore";
import { useHomeStore } from "lib/home/homeStore";

import { Step0 } from "./steps/Step0";
import { Step1 } from "./steps/Step1";
import { Step2 } from "./steps/Step2";
import { Step3 } from "./steps/Step3";

const stepMap = {
  0: Step0,
  1: Step1,
  2: Step2,
  3: Step3,
};

export const Game = ({ isSpectate }: { isSpectate?: boolean }) => {
  const router = useRouter();
  const gameState = useGameStore((state) => state.state);
  const players = useGameStore((state) => state.players);
  const playerId = useHomeStore((state) => state.playerId);
  const playerName = useHomeStore((state) => state.playerName);

  const gameId = router.query.gameId as string;

  useEffect(() => {
    window.scroll(0, 0);
  }, [gameState.currentStep]);

  const props = {
    gameId,
    gameState,
    players,
    playerId,
    playerName,
    isSpectate,
  };

  const Component = stepMap[gameState.currentStep as keyof typeof stepMap];

  return <Component {...props} />;
};

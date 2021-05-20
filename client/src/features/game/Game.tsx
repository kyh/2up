import { useEffect } from "react";
import { useGameChannel } from "features/game/GameProvider";
import { useGame } from "features/game/gameSlice";
import { usePlayhouse } from "features/home/playhouseSlice";

import { Step0 } from "./steps/Step0";
import { Step1 } from "./steps/Step1";
import { Step2 } from "./steps/Step2";
import { Step3 } from "./steps/Step3";

export const Game = () => {
  const { broadcast } = useGameChannel();
  const { state: gameState, dispatch } = useGame();
  const {
    state: { userId, name },
  } = usePlayhouse();

  useEffect(() => {
    window.scroll(0, 0);
  }, [gameState.step]);

  switch (gameState.step) {
    case 0:
      return (
        <Step0
          gameState={gameState}
          broadcast={broadcast}
          dispatch={dispatch}
          userId={userId}
          name={name}
        />
      );
    case 1:
      return (
        <Step1
          gameState={gameState}
          broadcast={broadcast}
          dispatch={dispatch}
          userId={userId}
          name={name}
        />
      );
    case 2:
      return (
        <Step2
          gameState={gameState}
          broadcast={broadcast}
          dispatch={dispatch}
          userId={userId}
          name={name}
        />
      );
    case 3:
      return (
        <Step3
          gameState={gameState}
          broadcast={broadcast}
          dispatch={dispatch}
          userId={userId}
          name={name}
        />
      );
    default:
      return null;
  }
};

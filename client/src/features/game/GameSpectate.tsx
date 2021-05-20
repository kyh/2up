import { useGameChannel } from "features/game/GameProvider";
import { useGame } from "features/game/gameSlice";

import { Step0Spectate } from "./steps/Step0";
import { Step1Spectate } from "./steps/Step1";
import { Step2Spectate } from "./steps/Step2";
import { Step3Spectate } from "./steps/Step3";

export const GameSpectate = () => {
  const { broadcast } = useGameChannel();
  const { state: gameState, dispatch } = useGame();

  switch (gameState.step) {
    case 0:
      return (
        <Step0Spectate
          gameState={gameState}
          broadcast={broadcast}
          dispatch={dispatch}
        />
      );
    case 1:
      return (
        <Step1Spectate
          gameState={gameState}
          broadcast={broadcast}
          dispatch={dispatch}
        />
      );
    case 2:
      return (
        <Step2Spectate
          gameState={gameState}
          broadcast={broadcast}
          dispatch={dispatch}
        />
      );
    case 3:
      return (
        <Step3Spectate
          gameState={gameState}
          broadcast={broadcast}
          dispatch={dispatch}
        />
      );
    default:
      return null;
  }
};

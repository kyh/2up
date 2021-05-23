import { useGameChannel } from "features/game/GameProvider";
import { useAppDispatch, useAppSelector } from "app/hooks";

import { Step0Spectate } from "./steps/Step0";
import { Step1Spectate } from "./steps/Step1";
import { Step2Spectate } from "./steps/Step2";
import { Step3Spectate } from "./steps/Step3";

export const GameSpectate = () => {
  const { broadcast } = useGameChannel();
  const dispatch = useAppDispatch();
  const gameState = useAppSelector((state) => state.game);

  switch (gameState.step) {
    case 0:
      return (
        <Step0Spectate
          gameState={gameState}
          broadcast={broadcast}
          dispatch={dispatch}
          name=""
        />
      );
    case 1:
      return (
        <Step1Spectate
          gameState={gameState}
          broadcast={broadcast}
          dispatch={dispatch}
          name=""
        />
      );
    case 2:
      return (
        <Step2Spectate
          gameState={gameState}
          broadcast={broadcast}
          dispatch={dispatch}
          name=""
        />
      );
    case 3:
      return (
        <Step3Spectate
          gameState={gameState}
          broadcast={broadcast}
          dispatch={dispatch}
          name=""
        />
      );
    default:
      return null;
  }
};

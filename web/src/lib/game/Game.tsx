import { useEffect } from "react";
import { useGameChannel } from "~/lib/game/GameProvider";
import { useAppDispatch, useAppSelector } from "~/utils/redux";

import { Step0 } from "./steps/Step0";
import { Step1 } from "./steps/Step1";
import { Step2 } from "./steps/Step2";
import { Step3 } from "./steps/Step3";

import { Step0Spectate } from "./steps/Step0";
import { Step1Spectate } from "./steps/Step1";
import { Step2Spectate } from "./steps/Step2";
import { Step3Spectate } from "./steps/Step3";

export const Game = ({ isSpectate }: { isSpectate?: boolean }) => {
  const { broadcast } = useGameChannel();
  const dispatch = useAppDispatch();
  const gameState = useAppSelector((state) => state.game);
  const name = useAppSelector((state) => state.playhouse.name);

  useEffect(() => {
    window.scroll(0, 0);
  }, [gameState.step]);

  const props = { gameState, broadcast, dispatch, name };

  switch (gameState.step) {
    case 0:
      return isSpectate ? <Step0Spectate {...props} /> : <Step0 {...props} />;
    case 1:
      return isSpectate ? <Step1Spectate {...props} /> : <Step1 {...props} />;
    case 2:
      return isSpectate ? <Step2Spectate {...props} /> : <Step2 {...props} />;
    case 3:
      return isSpectate ? <Step3Spectate {...props} /> : <Step3 {...props} />;
    default:
      return null;
  }
};

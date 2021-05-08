import { useGameChannel } from "features/game/GameChannel";

import { Step0Spectate } from "./steps/Step0";
import { Step1Spectate } from "./steps/Step1";
import { Step2Spectate } from "./steps/Step2";
import { Step3Spectate } from "./steps/Step3";
import { Step4Spectate } from "./steps/Step4";

export const GameSpectate = () => {
  const { state, broadcast, dispatch } = useGameChannel();

  switch (state.scene) {
    case 0:
      return (
        <Step0Spectate
          broadcast={broadcast}
          state={state}
          dispatch={dispatch}
        />
      );
    case 1:
      return <Step1Spectate broadcast={broadcast} state={state} />;
    case 2:
      return <Step2Spectate broadcast={broadcast} state={state} />;
    case 3:
      return <Step3Spectate broadcast={broadcast} state={state} />;
    case 4:
      return <Step4Spectate broadcast={broadcast} state={state} />;
    default:
      return null;
  }
};

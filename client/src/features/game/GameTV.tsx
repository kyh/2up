import React from "react";
import { useGameChannel } from "features/game/GameChannel";

import { Step0TV } from "./steps/Step0";
import { Step1TV } from "./steps/Step1";
import { Step2TV } from "./steps/Step2";
import { Step3TV } from "./steps/Step3";
import { Step4TV } from "./steps/Step4";

export const GameTV: React.FC = () => {
  const { state, broadcast, dispatch } = useGameChannel();

  switch (state.scene) {
    case 0:
      return (
        <Step0TV broadcast={broadcast} state={state} dispatch={dispatch} />
      );
    case 1:
      return <Step1TV broadcast={broadcast} state={state} />;
    case 2:
      return <Step2TV broadcast={broadcast} state={state} />;
    case 3:
      return <Step3TV broadcast={broadcast} state={state} />;
    case 4:
      return <Step4TV broadcast={broadcast} state={state} />;
    default:
      return null;
  }
};

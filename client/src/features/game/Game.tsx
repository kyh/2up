import React, { useEffect } from "react";
import { useGameChannel } from "features/game/GameChannel";
import { usePlayhouse } from "features/home/playhouseSlice";

import { Step0 } from "./steps/Step0";
import { Step1 } from "./steps/Step1";
import { Step2 } from "./steps/Step2";
import { Step3 } from "./steps/Step3";

export const Game: React.FC = () => {
  const {
    state: { userId, name },
  } = usePlayhouse();
  const { state, broadcast, dispatch } = useGameChannel();

  useEffect(() => {
    window.scroll(0, 0);
  }, [state.step]);

  switch (state.step) {
    case 0:
      return (
        <Step0
          state={state}
          broadcast={broadcast}
          dispatch={dispatch}
          userId={userId}
          name={name}
        />
      );
    case 1:
      return (
        <Step1
          state={state}
          broadcast={broadcast}
          dispatch={dispatch}
          userId={userId}
          name={name}
        />
      );
    case 3:
      return (
        <Step2
          state={state}
          broadcast={broadcast}
          dispatch={dispatch}
          userId={userId}
          name={name}
        />
      );
    case 4:
      return (
        <Step3
          state={state}
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

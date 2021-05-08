import React, { useEffect } from "react";
import { useGameChannel } from "features/game/GameChannel";
import { usePlayhouse } from "features/home/playhouseSlice";

import { Step0 } from "./steps/Step0";
import { Step1 } from "./steps/Step1";
import { Step2 } from "./steps/Step2";
import { Step3 } from "./steps/Step3";
import { Step4 } from "./steps/Step4";

export const Game: React.FC = () => {
  const {
    state: { userId, username },
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
          name={username}
        />
      );
    case 1:
      return (
        <Step1
          state={state}
          broadcast={broadcast}
          userId={userId}
          name={username}
        />
      );
    case 2:
      return (
        <Step2
          state={state}
          broadcast={broadcast}
          userId={userId}
          name={username}
        />
      );
    case 3:
      return (
        <Step3
          state={state}
          broadcast={broadcast}
          userId={userId}
          name={username}
        />
      );
    case 4:
      return (
        <Step4
          state={state}
          broadcast={broadcast}
          userId={userId}
          name={username}
        />
      );
    default:
      return null;
  }
};

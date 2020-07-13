import React, { useEffect } from "react";
import { useGameChannel } from "features/game/GameChannel";
import { usePlayhouse } from "features/home/playhouseSlice";

import { Step0Remote } from "./steps/Step0";
import { Step1Remote } from "./steps/Step1";
import { Step2Remote } from "./steps/Step2";
import { Step3Remote } from "./steps/Step3";
import { Step4Remote } from "./steps/Step4";

export const GameRemote: React.FC = () => {
  const {
    state: { userId, name },
  } = usePlayhouse();
  const { state, broadcast, dispatch } = useGameChannel();

  useEffect(() => {
    window.scroll(0, 0);
  }, [state.scene]);

  switch (state.scene) {
    case 0:
      return (
        <Step0Remote
          state={state}
          broadcast={broadcast}
          dispatch={dispatch}
          userId={userId}
          name={name}
        />
      );
    case 1:
      return (
        <Step1Remote
          state={state}
          broadcast={broadcast}
          userId={userId}
          name={name}
        />
      );
    case 2:
      return (
        <Step2Remote
          state={state}
          broadcast={broadcast}
          userId={userId}
          name={name}
        />
      );
    case 3:
      return (
        <Step3Remote
          state={state}
          broadcast={broadcast}
          userId={userId}
          name={name}
        />
      );
    case 4:
      return (
        <Step4Remote
          state={state}
          broadcast={broadcast}
          userId={userId}
          name={name}
        />
      );
    default:
      return null;
  }
};

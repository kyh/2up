import React, { useEffect } from "react";
import { useGameChannel } from "features/game/GameChannel";
import { usePlayhouse } from "features/home/playhouseSlice";
import { Scene0Remote } from "./steps/Scene0";
import { Scene1Remote } from "./steps/Scene1";
import { Scene2Remote } from "./steps/Scene2";
import { Scene3Remote } from "./steps/Scene3";
import { Scene4Remote } from "./steps/Scene4";

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
        <Scene0Remote
          state={state}
          broadcast={broadcast}
          dispatch={dispatch}
          userId={userId}
          name={name}
        />
      );
    case 1:
      return (
        <Scene1Remote
          state={state}
          broadcast={broadcast}
          userId={userId}
          name={name}
        />
      );
    case 2:
      return (
        <Scene2Remote
          state={state}
          broadcast={broadcast}
          userId={userId}
          name={name}
        />
      );
    case 3:
      return (
        <Scene3Remote
          state={state}
          broadcast={broadcast}
          userId={userId}
          name={name}
        />
      );
    case 4:
      return (
        <Scene4Remote
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

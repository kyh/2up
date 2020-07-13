import React from "react";
import { useGameChannel } from "features/game/GameChannel";
import { Scene0TV } from "./steps/Scene0";
import { Scene1TV } from "./steps/Scene1";
import { Scene2TV } from "./steps/Scene2";
import { Scene3TV } from "./steps/Scene3";
import { Scene4TV } from "./steps/Scene4";

export const GameTV: React.FC = () => {
  const { state, broadcast, dispatch } = useGameChannel();

  switch (state.scene) {
    case 0:
      return (
        <Scene0TV broadcast={broadcast} state={state} dispatch={dispatch} />
      );
    case 1:
      return <Scene1TV broadcast={broadcast} state={state} />;
    case 2:
      return <Scene2TV broadcast={broadcast} state={state} />;
    case 3:
      return <Scene3TV broadcast={broadcast} state={state} />;
    case 4:
      return <Scene4TV broadcast={broadcast} state={state} />;
    default:
      return null;
  }
};

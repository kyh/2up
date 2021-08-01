import { combineReducers } from "@reduxjs/toolkit";
import { playhouseReducer } from "features/home/playhouseSlice";
import { gameReducer } from "features/game/gameSlice";

export const rootReducer = combineReducers({
  playhouse: playhouseReducer,
  game: gameReducer,
});

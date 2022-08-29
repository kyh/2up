import { combineReducers } from "@reduxjs/toolkit";
import { playhouseReducer } from "lib/home/playhouseSlice";
import { gameReducer } from "lib/game/gameSlice";

export const rootReducer = combineReducers({
  playhouse: playhouseReducer,
  game: gameReducer,
});

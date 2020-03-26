import { combineReducers } from '@reduxjs/toolkit';

import { playhouseReducer } from 'features/home/playhouseSlice';
import { gameReducer } from 'features/game/gameSlice';

const rootReducer = combineReducers({
  playhouse: playhouseReducer,
  game: gameReducer
});

export type RootState = ReturnType<typeof rootReducer>;

export default rootReducer;

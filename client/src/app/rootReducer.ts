import { combineReducers } from '@reduxjs/toolkit';

import { playhouseReducer } from 'features/home/playhouseSlice';
import { triviaReducer } from 'features/trivia/triviaSlice';

const rootReducer = combineReducers({
  playhouse: playhouseReducer,
  trivia: triviaReducer
});

export type RootState = ReturnType<typeof rootReducer>;

export default rootReducer;

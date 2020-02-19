import { combineReducers } from '@reduxjs/toolkit';

import { appReducer } from './appSlice';
import { triviaReducer } from 'features/trivia/triviaSlice';

const rootReducer = combineReducers({
  app: appReducer,
  trivia: triviaReducer
});

export type RootState = ReturnType<typeof rootReducer>;

export default rootReducer;

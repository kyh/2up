import { combineReducers } from '@reduxjs/toolkit';

import appSlice from './appSlice';
// import triviaSlice from 'games/trivia/triviaSlice';

const rootReducer = combineReducers({
  app: appSlice
  // trivia: triviaSlice
});

export type RootState = ReturnType<typeof rootReducer>;

export default rootReducer;

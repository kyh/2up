import { combineReducers } from '@reduxjs/toolkit';

import { appReducer } from './appSlice';
// import triviaSlice from 'games/trivia/triviaSlice';

const rootReducer = combineReducers({
  app: appReducer
  // trivia: triviaSlice
});

export type RootState = ReturnType<typeof rootReducer>;

export default rootReducer;

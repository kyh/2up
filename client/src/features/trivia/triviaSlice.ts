import { createSlice } from '@reduxjs/toolkit';
import { GameState, Player } from 'features/types';

export interface TriviaGameState extends GameState {
  act: number;
  scene: number;
  question?: string;
  answer?: string;
  players: Player[];
  submissions: Submission[];
}

export interface Submission {
  id: number;
  name: string;
  content: string;
  endorsers: Player[];
}

export interface SceneProps {
  state: TriviaGameState;
  broadcast: (_eventName: string, _payload?: object) => void;
}

export const initialState: TriviaGameState = {
  gameID: null,
  connected: false,
  players: [],
  act: 0,
  scene: 0,
  question: '',
  answer: '',
  submissions: []
};

const triviaSlice = createSlice({
  name: 'trivia',
  initialState,
  reducers: {
    phx_reply(state, { payload }) {
      console.log('phx_reply', payload);
      state.connected = true;
    },
    phx_error(state) {
      state.connected = false;
    },
    game_state(state, { payload }) {
      console.log('new game state', payload);
      state = { ...state, ...payload };
    }
  }
});

export const triviaActions = triviaSlice.actions;
export const triviaReducer = triviaSlice.reducer;

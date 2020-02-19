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
    new_game(state, { payload }) {
      state.gameID = payload.gameID;
    },
    game_state(state, { payload }) {
      state.players = payload.players ?? state.players;
      state.act = payload.act ?? state.act;
      state.scene = payload.scene ?? state.scene;
      state.question = payload.question ?? state.question;
      state.answer = payload.answer ?? state.answer;
      state.submissions = payload.submissions ?? state.submissions;
    }
  }
});

export const triviaActions = triviaSlice.actions;
export const triviaReducer = triviaSlice.reducer;

import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { GameState, Player } from 'features/types';

export type TriviaState = {
  act: number;
  scene: number;
  question?: string;
  answer?: string;
  players: Player[];
  submissions: Submission[];
};

export type TriviaGameState = TriviaState & GameState;

export type Submission = {
  id: number;
  name: string;
  content: string;
  endorsers: Player[];
};

export type SceneProps = {
  state: TriviaGameState;
  broadcast: (_eventName: string, _payload?: object) => void;
};

export const initialState: TriviaGameState = {
  gameID: '',
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
    new_game(state, { payload }: PayloadAction<{ gameID: string }>) {
      state.gameID = payload.gameID;
    },
    game_state(state, { payload }: PayloadAction<TriviaState>) {
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

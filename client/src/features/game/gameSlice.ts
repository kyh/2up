import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { useSelector, useDispatch } from 'react-redux';
import { Player } from 'features/types';
import { RootState } from 'app/rootReducer';

export type GameState = {
  gameId: string;
  players: Player[];
  isHost: boolean;
  act: number;
  scene: number;
  question?: string;
  questionType?: string;
  instruction?: string;
  answer?: string;
  answerType?: string;
  submissions: Submission[];
  pack: string;
};

export type Submission = {
  id: number;
  name: string;
  content: string;
  endorsers: Player[];
};

export type SceneProps = {
  state: GameState;
  broadcast: (_eventName: string, _payload?: object) => void;
  userId?: string;
  name?: string;
};

export const initialState: GameState = {
  isHost: localStorage.getItem('isHost') === 'true',
  gameId: '',
  players: [],
  act: 0,
  scene: 0,
  question: '',
  questionType: '',
  instruction: '',
  answer: '',
  answerType: '',
  submissions: [],
  pack: ''
};

const sortByName = (a: Player, b: Player) => {
  if (a.name < b.name) {
    return -1;
  }
  if (a.name > b.name) {
    return 1;
  }
  return 0;
};

const gameSlice = createSlice({
  name: 'game',
  initialState,
  reducers: {
    new_game: (state, { payload }: PayloadAction<{ gameId: string }>) => {
      state.gameId = payload.gameId;
    },
    game_state: (state, { payload }: PayloadAction<GameState>) => {
      state.act = payload.act ?? state.act;
      state.scene = payload.scene ?? state.scene;
      state.question = payload.question ?? state.question;
      state.instruction = payload.instruction ?? state.instruction;
      state.answer = payload.answer ?? state.answer;
      state.submissions = payload.submissions ?? state.submissions;
      state.instruction = payload.instruction ?? state.instruction;
      state.questionType = payload.questionType ?? state.questionType;
      state.answerType = payload.answerType ?? state.answerType;
      state.pack = payload.pack ?? payload.pack;
    },
    toggle_host: (state, { payload }: PayloadAction<boolean>) => {
      state.isHost = payload;
      localStorage.setItem('isHost', state.isHost.toString());
    },
    players: (state, { payload }: PayloadAction<{ players: Player[] }>) => {
      state.players = payload.players.sort(sortByName) ?? state.players;
    },
    reset: () => ({ ...initialState, isHost: false })
  }
});

export const gameActions = gameSlice.actions;
export const gameReducer = gameSlice.reducer;
export const useGame = () => {
  const state = useSelector((state: RootState) => state.game);
  const dispatch = useDispatch();
  return { state, dispatch };
};

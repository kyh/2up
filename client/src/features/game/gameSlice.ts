import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "app/rootReducer";

export type GameState = {
  gameId: string;
  pack: string;
  scene: number;
  step: number;
  instruction?: string;
  question?: string;
  questionType?: string;
  sceneAnswers?: SceneAnswer[];
  answerType?: string;
  submissions: Submission[];
  // comes from presence
  players: Player[];
};

export type Player = {
  id: string;
  name: string;
  score: number;
};

export type SceneAnswer = {
  id?: string;
  isCorrect?: boolean;
  content?: string;
};

export type Submission = {
  id: number;
  name: string;
  content: string;
};

export type StepProps = {
  gameState: GameState;
  broadcast: (_eventName: string, _payload?: object) => void;
  dispatch: (_action: object) => void;
  userId?: string;
  name?: string;
};

export const initialState: GameState = {
  gameId: "",
  scene: 0,
  step: 0,
  instruction: "",
  question: "",
  questionType: "",
  sceneAnswers: [],
  answerType: "",
  submissions: [],
  pack: "",
  players: [],
};

const sortByName = (a: Player, b: Player) => {
  if (a.name < b.name) return -1;
  if (a.name > b.name) return 1;
  return 0;
};

const gameSlice = createSlice({
  name: "game",
  initialState,
  reducers: {
    new_game: (state, { payload }: PayloadAction<{ gameId: string }>) => {
      state.gameId = payload.gameId;
    },
    game_state: (state, { payload }: PayloadAction<GameState>) => {
      state.scene = payload.scene ?? state.scene;
      state.step = payload.step ?? state.step;
      state.instruction = payload.instruction ?? state.instruction;
      state.question = payload.question ?? state.question;
      state.questionType = payload.questionType ?? state.questionType;
      state.sceneAnswers = payload.sceneAnswers ?? state.sceneAnswers;
      state.answerType = payload.answerType ?? state.answerType;
      state.submissions = payload.submissions ?? state.submissions;
      state.pack = payload.pack ?? payload.pack;
    },
    players: (state, { payload }: PayloadAction<{ players: Player[] }>) => {
      state.players = payload.players.sort(sortByName) ?? state.players;
    },
    reset: () => ({ ...initialState }),
  },
});

export const gameActions = gameSlice.actions;
export const gameReducer = gameSlice.reducer;
export const useGame = () => {
  const state = useSelector((state: RootState) => state.game);
  const dispatch = useDispatch();
  return { state, dispatch };
};

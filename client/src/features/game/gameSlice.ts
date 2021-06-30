import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type GameState = {
  gameId: string;
  pack: string;
  scene: number;
  step: number;
  instruction: string;
  question: string;
  questionType: string;
  sceneAnswers: SceneAnswer[];
  answerType: string;
  submissions: Submission[];
  totalScenes: number;
  duration: number;
  startTime: number;
  // comes from presence
  players: Player[];
  // local states
  invitedToGame: string | undefined; // whether to show "invited to" modal
};

export type Player = {
  name: string;
  score: number;
  prevScore: number;
  isSpectator: boolean;
};

export type SceneAnswer = {
  id: string;
  isCorrect: boolean;
  content: string;
};

export type Submission = {
  name: string;
  content: string;
};

export type StepProps = {
  name: string;
  gameState: GameState;
  broadcast: (_eventName: string, _payload?: object) => void;
  dispatch: (_action: object) => void;
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
  totalScenes: 10,
  duration: 45000,
  startTime: Date.now(),
  players: [],
  invitedToGame: undefined,
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
      state.totalScenes = payload.totalScenes ?? state.totalScenes;
      state.duration = payload.duration ?? state.duration;
      state.startTime = payload.startTime ?? state.startTime;
    },
    players: (state, { payload }: PayloadAction<{ players: Player[] }>) => {
      state.players =
        payload.players.sort((a, b) => {
          if (a.name < b.name) return -1;
          if (a.name > b.name) return 1;
          return 0;
        }) ?? state.players;
    },
    invite: (
      state,
      { payload }: PayloadAction<{ gameId: GameState["invitedToGame"] }>
    ) => {
      state.invitedToGame = payload.gameId;
      if (!payload.gameId) {
        localStorage.removeItem("lastGameId");
      }
    },
    reset: (
      _state,
      { payload }: PayloadAction<{ gameId: GameState["invitedToGame"] }>
    ) => {
      if (payload.gameId) {
        localStorage.setItem("lastGameId", payload.gameId);
      } else {
        localStorage.removeItem("lastGameId");
      }
      return { ...initialState };
    },
  },
});

export const gameActions = gameSlice.actions;
export const gameReducer = gameSlice.reducer;

export const QuestionTypeSlugs = {
  text: {
    id: "text",
    display: "Text",
  },
  // richText: {
  //   id: "rich_text",
  //   display: "Rich Text",
  // },
  image: {
    id: "image",
    display: "Image",
  },
  video: {
    id: "video",
    display: "Video",
  },
  audio: {
    id: "audio",
    display: "Audio",
  },
  // code: {
  //   id: "code",
  //   display: "Code",
  // },
  // sheet: {
  //   id: "sheet",
  //   display: "Spreadsheet",
  // },
};

export const AnswerTypeSlugs = {
  text: {
    id: "text",
    display: "Text",
  },
  multiText: {
    id: "multi_text",
    display: "Multiple Choice",
  },
  letterText: {
    id: "letter_text",
    display: "Letters",
  },
  // multiImage: {
  //   id: "multi_image",
  //   display: "Multiple Image",
  // },
  // swipeText: {
  //   id: "swipe_text",
  //   display: "Swipe Text",
  // },
  // swipeImage: {
  //   id: "swipe_image",
  //   display: "Swipe Image",
  // },
  // sortText: {
  //   id: "sort_text",
  //   display: "Sort",
  // },
  // code: {
  //   id: "code",
  //   display: "Code",
  // },
};

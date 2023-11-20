import type {
  AnswerType,
  QuestionType,
  Scene,
  SceneAnswer,
} from "@prisma/client";

export type GameView =
  | "lobby"
  | "question"
  | "results"
  | "scoreboard"
  | "leaderboard";

export type GameState = {
  scenes: Scene[];
  players: LivePlayer[];

  // Scene state
  currentView: GameView;
  currentSceneIndex: number;

  duration: number;
  startTime: number;

  questionType: QuestionType;
  question: Scene["question"];
  questionDescription: Scene["questionDescription"];

  answerType: AnswerType;
  answers: Omit<SceneAnswer, "sceneId" | "updatedAt" | "createdAt">[];
  answerDescription: Scene["answerDescription"];

  playerSubmissions: PlayerSubmission[];
};

export type PlayerSubmission = {
  player: LivePlayer;
  submission: {
    content: string;
    isCorrect: boolean;
  };
};

export type LivePlayer = {
  id: string;
  name: string;
  prevScore: number;
  score: number;
};

export type PlayerAction = {
  type: "start" | "submit" | "next";
  payload?: unknown;
};

export type ServerAction = PlayerAction & {
  player: LivePlayer;
};

export const createGame = (): GameState => {
  return {
    scenes: [],
    players: [],

    currentView: "lobby",
    currentSceneIndex: 0,

    duration: 45,
    startTime: Date.now(),

    questionType: "text",
    question: "",
    questionDescription: "",

    answerType: "text",
    answers: [],
    answerDescription: "",

    playerSubmissions: [],
  };
};

export const updateGame = (
  action: ServerAction,
  state: GameState,
): GameState => {
  return state;
};

export const addPlayer = (
  player: Pick<LivePlayer, "id" | "name">,
  state: GameState,
): GameState => {
  state.players = [...state.players, { ...player, score: 0, prevScore: 0 }];
  return state;
};

export const removePlayer = (
  playerId: LivePlayer["id"],
  state: GameState,
): GameState => {
  state.players = state.players.filter((player) => player.id !== playerId);
  return state;
};

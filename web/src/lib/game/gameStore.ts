import create from "zustand";
import shallow from "zustand/shallow";
import type {
  Scene,
  QuestionType,
  AnswerType,
  SceneAnswer,
  Player,
} from "@prisma/client";

export type GameState = {
  currentStep: number;
  currentScene: number;
  submissions: Submission[];
  totalScenes: number;
  duration: number;
  startTime: number;

  questionDescription: Scene["questionDescription"];
  question: Scene["question"];
  questionType: QuestionType;
  answerType: AnswerType;
  sceneAnswers: Omit<SceneAnswer, "sceneId" | "updatedAt" | "createdAt">[];
};

export type Submission = {
  playerId: Player["userId"];
  playerName: string;
  content: string;
  isCorrect?: boolean;
};

export type GameStore = {
  state: GameState;
  setGameState: (state: GameState) => void;
  players: Pick<Player, "userId" | "name" | "isSpectator">[];
  setPlayers: (
    players: Pick<Player, "userId" | "name" | "isSpectator">[]
  ) => void;
  playerScores: Player[];
  setPlayerScores: (players: Player[]) => void;
  isStarted: boolean;
  setIsStarted: (isStarted: boolean) => void;
  isFinished: boolean;
  setIsFinished: (isFinished: boolean) => void;
};

export const useGameStore = create<GameStore>()((set) => ({
  state: {
    currentStep: 0,
    currentScene: 0,
    submissions: [],
    totalScenes: 0,
    duration: 0,
    startTime: 0,
    questionDescription: "",
    question: "",
    questionType: "text",
    answerType: "text",
    sceneAnswers: [],
  },
  setGameState: (state) =>
    set((store) => ({ ...store, state: { ...store.state, ...state } })),
  players: [],
  setPlayers: (players) => set((store) => ({ ...store, players })),
  playerScores: [],
  setPlayerScores: (players) => set((store) => ({ ...store, players })),
  isStarted: false,
  setIsStarted: (isStarted) => set((store) => ({ ...store, isStarted })),
  isFinished: false,
  setIsFinished: (isFinished) => set((store) => ({ ...store, isFinished })),
}));

export const useAllGameStore = () => useGameStore((state) => state, shallow);

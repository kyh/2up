import { create } from "zustand";
import { shallow } from "zustand/shallow";
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
  playerScores: PlayerScore[];

  questionDescription: Scene["questionDescription"];
  question: Scene["question"];
  questionType: QuestionType;
  answerType: AnswerType;
  sceneAnswers: Omit<SceneAnswer, "sceneId" | "updatedAt" | "createdAt">[];
};

export type Submission = {
  playerId: Player["userId"];
  playerName: Player["name"];
  content: string;
  isCorrect?: boolean;
};

export type PlayerScore = {
  playerId: Player["userId"];
  playerName: Player["name"];
  prevScore: number;
  score: number;
};

export type LivePlayer = Pick<Player, "userId" | "name">;

export type GameStore = {
  state: GameState;
  setGameState: (state: GameState) => void;
  players: LivePlayer[];
  setPlayers: (players: LivePlayer[]) => void;
};

export const useGameStore = create<GameStore>()((set) => ({
  state: {
    currentStep: 0,
    currentScene: 0,
    submissions: [],
    totalScenes: 0,
    duration: 0,
    startTime: 0,
    playerScores: [],
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
}));

export const useAllGameStore = () => useGameStore((state) => state, shallow);

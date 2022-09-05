import create from "zustand";
import shallow from "zustand/shallow";
import type {
  Scene,
  QuestionType,
  AnswerType,
  SceneAnswer,
  Player,
} from "@prisma/client";

export type GameState = Partial<{
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
  sceneAnswers: SceneAnswer[];
}>;

type Submission = {
  playerId: Player["userId"];
  playerName: Player["name"];
  content: string;
  isCorrect?: boolean;
};

type GameStore = {
  state: GameState;
  setGameState: (state: GameState) => void;
  players: Player[];
  setPlayers: (players: Player[]) => void;
  isStarted: boolean;
  isFinished: boolean;
};

export const useGameStore = create<GameStore>()((set) => ({
  state: {},
  setGameState: (state) => set((store) => ({ ...store, state })),
  players: [],
  setPlayers: (players) => set((store) => ({ ...store, players })),
  isStarted: false,
  isFinished: false,
}));

export const useAllGameStore = () => useGameStore((state) => state, shallow);

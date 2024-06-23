import { SceneSchema } from "@2up/api/scene/scene-schema";

import { calculateScore, compareAnswer } from "./game-utils";

export type GameView =
  | "lobby"
  | "question"
  | "results"
  | "scoreboard"
  | "leaderboard";

export type GameState = {
  scenes: SceneSchema[];
  players: LivePlayer[];

  // Scene state
  currentView: GameView;
  currentSceneIndex: number;

  duration: number;
  startTime: number;

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

export const createGame = (scenes?: SceneSchema[]): GameState => {
  return {
    scenes: scenes ?? [],
    players: [],

    currentView: "lobby",
    currentSceneIndex: 0,

    duration: 45,
    startTime: Date.now(),

    playerSubmissions: [],
  };
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

export const updateGame = (
  action: ServerAction,
  state: GameState,
): GameState => {
  gameActions[action.type](action, state);

  return state;
};

const gameActions = {
  start: (_action: ServerAction, state: GameState) => {
    state.currentView = "question";
    state.startTime = Date.now();
  },

  submit: (action: ServerAction, state: GameState) => {
    const currentScene = state.scenes[state.currentSceneIndex];
    if (!currentScene) return;

    const correctAnswer = currentScene.answer.find(
      (answer) => answer.isCorrect,
    )!;

    // Update player scores and submissions
    state.players.forEach((player, index) => {
      if (player.id !== action.player.id) return;

      const currentPlayer = state.players[index]!;

      const isCorrect = compareAnswer(
        action.payload as string,
        correctAnswer.content ?? "",
      );

      const newScore = calculateScore(
        isCorrect,
        state.startTime,
        Date.now(),
        state.duration,
      );

      currentPlayer.prevScore = currentPlayer.score;
      currentPlayer.score += newScore;

      state.playerSubmissions.push({
        player: action.player,
        submission: {
          content: action.payload as string,
          isCorrect,
        },
      });
    });

    if (
      state.playerSubmissions.length === state.players.length &&
      state.currentView === "question"
    ) {
      state.currentView = "results";
    }
  },

  next: (_action: ServerAction, state: GameState) => {
    if (state.currentView === "results") {
      state.currentView = "scoreboard";
      return;
    }

    if (
      state.currentView === "scoreboard" &&
      state.currentSceneIndex === state.scenes.length - 1
    ) {
      state.currentView = "leaderboard";
      return;
    }

    state.currentSceneIndex += 1;
    state.currentView = "question";
    state.startTime = Date.now();
    state.playerSubmissions = [];
  },
};

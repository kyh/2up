import type { Scene, SceneAnswer } from "@prisma/client";

import { calculateScore, compareAnswer } from "./utils";

export type SceneWithAnswers = Scene & {
  sceneAnswers: SceneAnswer[];
};

export type GameView =
  | "lobby"
  | "question"
  | "results"
  | "scoreboard"
  | "leaderboard";

export type GameState = {
  scenes: SceneWithAnswers[];
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

export const createGame = (scenes?: SceneWithAnswers[]): GameState => {
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

export const updateGame = (
  action: ServerAction,
  state: GameState,
): GameState => {
  switch (action.type) {
    case "start":
      state.currentView = "question";
      state.startTime = Date.now();
      break;

    case "submit":
      // Update player submission
      state.playerSubmissions = [
        ...state.playerSubmissions,
        {
          player: action.player,
          submission: action.payload as PlayerSubmission["submission"],
        },
      ];

      // Update player score
      state.players = state.players.map((player) => {
        if (player.id !== action.player.id) return player;

        const currentScene = state.scenes[state.currentSceneIndex]!;
        const correctAnswer = currentScene.sceneAnswers.find(
          (answer) => answer.isCorrect,
        )!;

        const isCorrect = compareAnswer(
          action.payload as string,
          correctAnswer.content,
        );

        const newScore = calculateScore(
          isCorrect,
          state.startTime,
          Date.now(),
          state.duration,
        );

        return {
          ...player,
          prevScore: player.score,
          score: player.score + newScore,
        };
      });

      if (
        state.playerSubmissions.length === state.players.length &&
        state.currentView === "question"
      ) {
        state.currentView = "results";
      }

      break;

    case "next":
      if (state.currentView === "results") {
        state.currentView = "scoreboard";
        break;
      }

      if (
        state.currentView === "scoreboard" &&
        state.currentSceneIndex === state.scenes.length - 1
      ) {
        state.currentView = "leaderboard";
        break;
      }

      state.currentSceneIndex += 1;
      state.currentView = "question";
      state.startTime = Date.now();
      state.playerSubmissions = [];
      break;
  }

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

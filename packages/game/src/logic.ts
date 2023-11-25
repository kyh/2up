import type { Scene } from "@prisma/client";

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

export const createGame = (scenes?: Scene[]): GameState => {
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

// PlayroomKit-style hooks - Simple, ergonomic multiplayer API
export {
  usePlayroomRoot,
  useMultiplayerState,
  usePlayersList,
  usePlayerState,
  usePlayersState,
  useIsHost,
  useMyPlayer,
  getPlayer,
  getMyPlayerId,
  isConnected,
  getPlayerCount,
} from "./use-playroom";

export type { PlayroomConfig } from "./use-playroom";

// Core types
export type {
  Player,
  PlayerMap,
  GameState,
  ClientMessage,
  ServerMessage,
  GameMessage,
  PlayerJoinedMessage,
  PlayerLeftMessage,
  PlayerUpdatedMessage,
  GameSyncMessage,
} from "./types";
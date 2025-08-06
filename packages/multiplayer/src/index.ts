// Main realtime hook (supports both position tracking and entities)
export { useRealtimeGame } from "./use-realtime-game";
export type {
  RealtimeGameConfig,
  GameEntity,
  Position,
} from "./use-realtime-game";

// Specialized hooks
export { useTurnBasedGame } from "./use-turn-based-game";
export type {
  TurnBasedGameState,
  TurnBasedGameConfig,
} from "./use-turn-based-game";

// Base multiplayer hook
export { useMultiplayerGame } from "./use-multiplayer-game";
export type {
  MultiplayerGameConfig,
  MultiplayerGameState,
} from "./use-multiplayer-game";

// Re-export types from types module
export type {
  Player,
  PlayerMap,
  GameState,
  GameConfig,
  ClientMessage,
  ServerMessage,
  MessageType,
  GameMessage,
  ClientGameMessage,
  ServerGameMessage,
  PlayerJoinedMessage,
  PlayerLeftMessage,
  PlayerUpdatedMessage,
  GameSyncMessage,
  GameEventMessage,
} from "./types";

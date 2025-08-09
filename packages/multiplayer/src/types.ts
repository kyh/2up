// Core Player Types
export type Player = {
  id: string;
  color?: string;
  hue?: string;
  lastUpdate?: number;
  state?: Record<string, unknown>; // Individual player state (usePlayerState)
  metadata?: Record<string, unknown>; // Server metadata (host status, etc.)
};

export type PlayerMap = Record<string, Player>;

// Game State Types  
export type GameState<T = Record<string, unknown>> = T;

// Message Types
export type GameMessage<TData = unknown> = {
  type: string;
  data: TData;
  playerId?: string;
  timestamp?: number;
};

// Client Messages (sent to server)
export type ClientMessage<TData = unknown> = {
  type: "player_state_update" | "game_state_update";
  data: TData;
  playerId?: string;
  timestamp?: number;
};

// Server Messages (sent to clients)
export type PlayerJoinedMessage = {
  type: "player_joined";
  data: Player;
  timestamp?: number;
};

export type PlayerLeftMessage = {
  type: "player_left";
  data: { id: string };
  timestamp?: number;
};

export type PlayerUpdatedMessage = {
  type: "player_updated";
  data: Player;
  timestamp?: number;
};

export type GameSyncMessage<TGameState = unknown> = {
  type: "game_sync";
  data: {
    players: PlayerMap;
    gameState?: GameState<TGameState>;
  };
  timestamp?: number;
};

// Server message union
export type ServerMessage =
  | PlayerJoinedMessage
  | PlayerLeftMessage
  | PlayerUpdatedMessage
  | GameSyncMessage;
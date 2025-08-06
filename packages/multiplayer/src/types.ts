// Generic Game State Schema
export type GameState<T = Record<string, unknown>> = T;

export type PlayerState<T = Record<string, unknown>> = T;

export type Player = {
  id: string;
  color?: string;
  hue?: string;
  lastUpdate?: number;
  state?: PlayerState<unknown>;
  metadata?: Record<string, unknown>;
};

export type PlayerMap = Record<string, Player>;

// Message Types
export type GameMessage<TData = unknown> = {
  type: string;
  data: TData;
  playerId?: string;
  timestamp?: number;
};

// Client Messages (sent to server)
export type ClientGameMessage<TData = unknown> = {
  type:
    | "game_action"
    | "player_state_update"
    | "game_state_update"
    | "join_game"
    | "leave_game"
    | "custom";
} & GameMessage<TData>;

// Server Messages (sent to clients)
export type ServerGameMessage<TData = unknown> = {
  type:
    | "player_joined"
    | "player_left"
    | "player_updated"
    | "game_sync"
    | "game_event"
    | "custom";
} & GameMessage<TData>;

// Specific message types
export type PlayerJoinedMessage = {
  type: "player_joined";
  data: Player;
} & ServerGameMessage<Player>;

export type PlayerLeftMessage = {
  type: "player_left";
  data: { id: string };
} & ServerGameMessage<{ id: string }>;

export type PlayerUpdatedMessage = {
  type: "player_updated";
  data: Player;
} & ServerGameMessage<Player>;

export type GameSyncMessage<TGameState = unknown> = {
  type: "game_sync";
  data: {
    players: PlayerMap;
    gameState?: GameState<TGameState>;
  };
} & ServerGameMessage<{
  players: PlayerMap;
  gameState?: GameState<TGameState>;
}>;

export type GameEventMessage<TPayload = unknown> = {
  type: "game_event";
  data: {
    event: string;
    payload: TPayload;
    from?: string;
  };
} & ServerGameMessage<{
  event: string;
  payload: TPayload;
  from?: string;
}>;

// Union types
export type ClientMessage<TData = unknown> = ClientGameMessage<TData>;
export type ServerMessage<TGameState = unknown, TPayload = unknown> =
  | PlayerJoinedMessage
  | PlayerLeftMessage
  | PlayerUpdatedMessage
  | GameSyncMessage<TGameState>
  | GameEventMessage<TPayload>;
export type MessageType<TGameState = unknown, TPayload = unknown> =
  | ClientMessage<unknown>
  | ServerMessage<TGameState, TPayload>;

// Game Configuration
export type GameConfig<TSettings = Record<string, unknown>> = {
  maxPlayers?: number;
  gameType?: string;
  customSettings?: TSettings;
};

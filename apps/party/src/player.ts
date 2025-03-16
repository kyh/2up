// Schema
export type Position = {
  x?: number;
  y?: number;
  pointer?: "mouse" | "touch";
  pathname?: string;
};

export type Player = {
  id: string;
  color?: string;
  hue?: string;
  lastUpdate?: number;
  position?: Position;
};

export type PlayerMap = Record<string, Player>;

// These are messages coming from the client
export type PositionMessage = {
  type: "position";
  data: Position;
};

// These are messages coming from the server
export type UpdateMessage = {
  type: "update";
  data: Player;
};

export type SyncMessage = {
  type: "sync";
  data: PlayerMap;
};

export type RemoveMessage = {
  type: "remove";
  data: { id: string };
};

export type MessageType = UpdateMessage | SyncMessage | RemoveMessage;

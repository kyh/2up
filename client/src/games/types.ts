export interface GameState {
  gameID?: string;
  players: string[];
  connected: boolean;
}

export interface ServerResponse {
  event: any;
  payload: any;
}

export interface Player {
  id: string;
  name: string;
  coins: number;
}

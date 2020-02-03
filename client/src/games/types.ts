export interface GameState {
  gameID?: string;
  code: string;
  players: Player[];
  connected: boolean;
}

export interface ServerResponse {
  event: any;
  payload: any;
}

export interface Player {
  id: string;
  name: string;
  score: number;
}

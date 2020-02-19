export interface GameState {
  gameID: string;
  players: Player[];
}

export interface ServerResponse {
  event: string;
  payload: any;
}

export interface Player {
  id: string;
  name: string;
  coins: number;
}

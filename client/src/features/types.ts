export type GameState = {
  gameID: string;
  players: Player[];
  isHost: boolean;
};

export type ServerResponse = {
  event: string;
  payload: any;
};

export type Player = {
  id: string;
  name: string;
  coins: number;
};

import type { GameStore } from "~/lib/game/gameStore";
import type { HomeStore } from "~/lib/home/homeStore";

export type StepProps = {
  isSpectate?: boolean;
  gameId: string;
  gameState: GameStore["state"];
  players: GameStore["players"];
  playerId: HomeStore["playerId"];
  playerName: HomeStore["playerName"];
};

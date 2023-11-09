import type { GameStore } from "@/lib/game/game-store";
import type { HomeStore } from "@/lib/home/home-store";

export type StepProps = {
  isSpectate?: boolean;
  gameId: string;
  gameState: GameStore["state"];
  players: GameStore["players"];
  playerId: HomeStore["playerId"];
  playerName: HomeStore["playerName"];
};

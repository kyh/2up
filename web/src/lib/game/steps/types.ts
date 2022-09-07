import type { GameStore } from "~/lib/game/gameStore";
import type { PlayhouseStore } from "~/lib/home/playhouseStore";

export type StepProps = {
  isSpectate?: boolean;
  gameId: string;
  gameState: GameStore["state"];
  players: GameStore["players"];
  playerScores: GameStore["playerScores"];
  playerId: PlayhouseStore["playerId"];
  playerName: PlayhouseStore["playerName"];
};

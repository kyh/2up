import type { GameStore } from "~/lib/game/gameStore";
import type { PlayhouseStore } from "~/lib/home/playhouseStore";

export type StepProps = {
  isSpectate?: boolean;
  gameState: GameStore["state"];
  players: GameStore["players"];
  playerId: PlayhouseStore["playerId"];
  playerName: PlayhouseStore["playerName"];
};

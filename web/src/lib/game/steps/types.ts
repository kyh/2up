import type { GameStore } from "~/lib/game/gameStore";
import type { PlayhouseStore } from "~/lib/home/playhouseStore";

export type StepProps = {
  isSpectate?: boolean;
  gameState: GameStore["state"];
  players: GameStore["players"];
  playerId: PlayhouseStore["playerId"];
  playerName: PlayhouseStore["playerName"];
};

export type GameState = GameStore["state"];
export type Players = GameStore["players"];

export type QuestionType = StepProps["gameState"]["questionType"];

export type Submission = StepProps["gameState"]["submissions"][0];

export type AnswerType = StepProps["gameState"]["answerType"];
export type SceneAnswer = StepProps["gameState"]["sceneAnswers"][0];

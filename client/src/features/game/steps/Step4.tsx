import { Flex, Button } from "components";
import { StepProps } from "features/game/gameSlice";

export const Step4 = ({ state, broadcast, name }: StepProps) => {
  const [firstPlayer] = state.players;
  return (
    <div>
      <h2>Question: {state.scene} / 10</h2>
      {state.players.map((player) => (
        <Flex key={player.name} justifyContent="space-between" mb={3}>
          <span>{player.name}</span>
          <span>{player.score}</span>
        </Flex>
      ))}
      {firstPlayer && (
        <Button
          disabled={firstPlayer.name !== name}
          onClick={() => broadcast("scene:next")}
        >
          {firstPlayer.name === name
            ? "Next Question"
            : `Waiting for ${firstPlayer.name}`}
        </Button>
      )}
    </div>
  );
};

export const Step4Spectate = ({ state }: StepProps) => {
  return (
    <div>
      <h2>Question: {state.scene} / 10</h2>
      {state.players.map((player) => (
        <Flex key={player.name} justifyContent="space-between" mb={3}>
          <span>{player.name}</span>
          <span>{player.score}</span>
        </Flex>
      ))}
    </div>
  );
};

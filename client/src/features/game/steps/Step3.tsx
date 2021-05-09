import { Box, Flex, Button } from "components";
import { StepProps } from "features/game/gameSlice";

export const Step3 = ({ state, broadcast, name }: StepProps) => {
  const [firstPlayer] = state.players;
  return (
    <Box>
      <h2>Question: {state.scene} / 10</h2>
      {state.players.map((player) => (
        <Flex key={player.name} justifyContent="space-between" mb={3}>
          <span>{player.name}</span>
          <span>{player.score}</span>
        </Flex>
      ))}
      {firstPlayer && (
        <Box textAlign="center">
          <Button
            disabled={firstPlayer.name !== name}
            onClick={() => broadcast("scene:next")}
          >
            {firstPlayer.name === name
              ? "Next Question"
              : `Waiting for ${firstPlayer.name}`}
          </Button>
        </Box>
      )}
    </Box>
  );
};

export const Step3Spectate = ({ state }: StepProps) => {
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

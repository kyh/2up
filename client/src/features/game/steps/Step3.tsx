import styled from "styled-components";
import { Button } from "components";
import { StepProps } from "features/game/gameSlice";

export const Step3 = ({ state, broadcast, name }: StepProps) => {
  const [firstPlayer] = state.players;
  return (
    <section>
      <h2>Question: {state.scene} / 10</h2>
      {state.players.map((player) => (
        <PlayerContainer>
          <span>{player.name}</span>
          <span>{player.score}</span>
        </PlayerContainer>
      ))}
      {firstPlayer && (
        <NextButtonContainer>
          <Button
            disabled={firstPlayer.name !== name}
            onClick={() => broadcast("scene:next")}
          >
            {firstPlayer.name === name
              ? "Next Question"
              : `Waiting for ${firstPlayer.name}`}
          </Button>
        </NextButtonContainer>
      )}
    </section>
  );
};

export const Step3Spectate = ({ state }: StepProps) => {
  return (
    <section>
      <h2>Question: {state.scene} / 10</h2>
      {state.players.map((player) => (
        <PlayerContainer>
          <span>{player.name}</span>
          <span>{player.score}</span>
        </PlayerContainer>
      ))}
    </section>
  );
};

const PlayerContainer = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: ${({ theme }) => theme.spacings(3)};
`;

const NextButtonContainer = styled.div`
  text-align: center;
`;

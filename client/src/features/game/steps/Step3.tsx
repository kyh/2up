import styled from "styled-components";
import { StepProps, GameState } from "features/game/gameSlice";
import {
  PlayersGrid,
  Player,
  NextButton,
} from "features/game/components/PlayerGrid";

export const Step3 = ({ gameState, broadcast, name }: StepProps) => {
  const [firstPlayer] = gameState.players;
  return (
    <>
      <PlayerScores gameState={gameState} />
      {firstPlayer && (
        <NextButton
          disabled={firstPlayer.name !== name}
          onClick={() => broadcast("scene:next")}
          autoFocus
        >
          {firstPlayer.name === name
            ? "Next Question"
            : `Waiting for ${firstPlayer.name}`}
        </NextButton>
      )}
    </>
  );
};

export const Step3Spectate = ({ gameState }: StepProps) => {
  return <PlayerScores gameState={gameState} />;
};

const PlayerScores = ({ gameState }: { gameState: GameState }) => {
  const players = gameState.players.map((player) => {
    return (
      <Player
        key={player.name}
        playerName={player.name}
        playerContent={` - ${player.score}`}
      />
    );
  });

  return (
    <>
      <TitleContainer>
        <h2 className="title">Question: {gameState.scene} / 10</h2>
      </TitleContainer>
      <PlayerContainer>{players}</PlayerContainer>
    </>
  );
};

const TitleContainer = styled.div`
  margin-bottom: ${({ theme }) => theme.spacings(5)};
  .title {
    text-align: center;
    margin: 0;
  }
`;

const PlayerContainer = styled(PlayersGrid)`
  margin-bottom: ${({ theme }) => theme.spacings(5)};
  .name {
    text-align: center;
  }
  ${({ theme }) => theme.media.desktop`
    margin-bottom: 0;
  `}
`;

import { useState, useEffect } from "react";
import styled from "styled-components";
import { motion } from "framer-motion";
import { theme } from "styles/theme";
import { visible } from "styles/animations";
import { StepProps, GameState } from "features/game/gameSlice";
import {
  PlayersGrid,
  Player,
  NextButton,
} from "features/game/components/PlayerGrid";
import { Counter } from "components";

export const Step3 = ({ gameState, broadcast, name }: StepProps) => {
  const [firstPlayer] = gameState.players;
  return (
    <>
      <QuestionNumber>Question: {gameState.scene} / 10</QuestionNumber>
      <PlayerScores gameState={gameState} title="Scoreboard" />
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
  return (
    <>
      <QuestionNumber>Question: {gameState.scene} / 10</QuestionNumber>
      <PlayerScores gameState={gameState} title="Scoreboard" />
    </>
  );
};

const spring = {
  type: "spring",
  damping: 20,
  stiffness: 300,
};

const sortByScore = (scores: any) => {
  return [...scores].sort((a, b) => b.score - a.score);
};

export const PlayerScores = ({
  gameState,
  title,
}: {
  gameState: GameState;
  title: string;
}) => {
  const [isOldState, setIsOldState] = useState(true);
  const [players, setPlayers] = useState(sortByScore(gameState.prevScores));

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setIsOldState(false);
      setPlayers(sortByScore(gameState.players));
    }, 100);
    return () => clearTimeout(timeoutId);
  }, []);

  return (
    <>
      <TitleContainer>
        <h2 className="title">{title}</h2>
      </TitleContainer>
      <PlayersContainer singleCol>
        {players.map((player) => {
          const prevScore =
            gameState.prevScores.find((p) => p.name === player.name)?.score ||
            0;
          const currentScore = player.score;
          return (
            <PlayerContainer key={player.name} layout transition={spring}>
              <Player playerName={player.name} />
              <PlayerScore>
                {isOldState ? (
                  <span>{currentScore}</span>
                ) : (
                  <Counter from={prevScore} to={currentScore} />
                )}
              </PlayerScore>
            </PlayerContainer>
          );
        })}
      </PlayersContainer>
    </>
  );
};

const QuestionNumber = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  opacity: 0.4;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  pointer-events: none;
`;

const TitleContainer = styled.div`
  animation: ${visible} 0s linear 0.1s forwards;
  visibility: hidden;
  margin-bottom: ${theme.spacings(5)};
  .title {
    text-align: center;
    margin: 0;
  }
`;

const PlayersContainer = styled(PlayersGrid)`
  margin: 0 auto ${theme.spacings(5)};
  max-width: 300px;
  ${theme.breakpoints.desktop} {
    margin-bottom: 0;
    max-width: none;
  }
`;

const PlayerContainer = styled(motion.div)`
  display: flex;
  justify-content: space-between;
  align-items: center;
  ${theme.breakpoints.desktop} {
    flex-direction: column-reverse;
  }
`;

const PlayerScore = styled.h2`
  margin: 0;
  transform: translateY(-10px);
  ${theme.breakpoints.desktop} {
    margin-top: auto;
  }
`;

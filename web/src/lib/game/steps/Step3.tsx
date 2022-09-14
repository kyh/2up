import { useState, ReactNode } from "react";
import styled, { createGlobalStyle } from "styled-components";
import { motion } from "framer-motion";
import { theme, useIsDesktop } from "~/styles/theme";
import { visible } from "~/styles/animations";
import {
  PlayersGrid,
  Player,
  NextButton,
} from "~/lib/game/components/PlayerGrid";
import { Counter } from "~/components";
import { useTimeout } from "~/styles/animations";
import { maxScorePerScene, sortByKey } from "~/lib/game/gameUtils";
import { useNextScene } from "~/lib/game/useGameActions";
import type { StepProps } from "~/lib/game/steps/types";

export const Step3Play = ({
  gameId,
  gameState,
  players,
  playerName,
}: StepProps) => {
  const [firstPlayer] = players;
  const { nextScene, isLoading } = useNextScene();

  const handleNextStep = async () => {
    await nextScene(gameId);
  };

  return (
    <>
      <QuestionNumber>
        Question: {gameState.currentScene} / {gameState.totalScenes}
      </QuestionNumber>
      <PlayerScores
        playerScores={gameState.playerScores}
        gameState={gameState}
        title="Scoreboard"
      />
      {firstPlayer && (
        <NextButton
          disabled={isLoading || firstPlayer.name !== playerName}
          onClick={handleNextStep}
          autoFocus
        >
          {firstPlayer.name === playerName
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
      <QuestionNumber>
        Question: {gameState.currentScene} / {gameState.totalScenes}
      </QuestionNumber>
      <PlayerScores
        playerScores={gameState.playerScores}
        gameState={gameState}
        title="Scoreboard"
      />
    </>
  );
};

type PlayerScoresProps = {
  gameState: StepProps["gameState"];
  playerScores: StepProps["gameState"]["playerScores"];
  title: string;
};

export const PlayerScores = ({
  gameState,
  playerScores,
  title,
}: PlayerScoresProps) => {
  const desktop = useIsDesktop();
  const [isOldState, setIsOldState] = useState(true);
  const [sortedPlayers, setPlayers] = useState(
    sortByKey(playerScores, "prevScore")
  );

  useTimeout(() => {
    setIsOldState(false);
    if (!desktop) {
      // Sort players by score if they're not on a desktop
      setPlayers(sortByKey(playerScores, "score"));
    }
  }, 150);

  return (
    <>
      <NoScroll />
      <TitleContainer>
        <h2 className="title">{title}</h2>
      </TitleContainer>
      <PlayersContainer singleCol>
        {sortedPlayers.map(({ playerId, playerName, prevScore, score }) => {
          return (
            <PlayerContainer
              key={playerId}
              desktop={desktop}
              score={isOldState ? prevScore : score}
              totalScenes={gameState.totalScenes}
            >
              <Player playerName={playerName} />
              <PlayerScore>
                {isOldState ? (
                  <span>{prevScore}</span>
                ) : (
                  <Counter from={prevScore} to={score} />
                )}
              </PlayerScore>
            </PlayerContainer>
          );
        })}
      </PlayersContainer>
    </>
  );
};

const spring = {
  type: "spring",
  damping: 20,
  stiffness: 300,
};

type PlayerContainerProps = {
  children: ReactNode;
  desktop: boolean;
  score: number;
  totalScenes: number;
};

const PlayerContainer = ({
  children,
  desktop,
  score,
  totalScenes,
}: PlayerContainerProps) => {
  // Animate scores if on mobile
  if (!desktop) {
    return (
      <APC layout transition={spring}>
        {children}
      </APC>
    );
  }
  return (
    <PC score={score} totalScenes={totalScenes}>
      {children}
    </PC>
  );
};

const NoScroll = createGlobalStyle`
  ${theme.breakpoints.desktop} {
    body { overflow: hidden }
  }
`;

const maxScoreHeight = "40vh";

const calculateScorebarHeight = (score: number, totalScenes: number) => {
  const maxScoreHeightNum = parseInt(maxScoreHeight.replace("vh", ""));
  const maxScore = totalScenes * maxScorePerScene;
  const percentage = score / maxScore;
  return `-${maxScoreHeightNum * percentage}vh`;
};

const QuestionNumber = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  filter: brightness(0.4);
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
  padding-top: 50px;

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

const APC = styled(motion.div)`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const PC = styled.div<{ score: number; totalScenes: number }>`
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-direction: column-reverse;
  transition: transform 1s ease;
  transform: translateY(
    ${({ score, totalScenes }) => calculateScorebarHeight(score, totalScenes)}
  );
  &::after {
    content: "";
    position: absolute;
    bottom: -${maxScoreHeight};
    height: ${maxScoreHeight};
    width: 100%;
    border-top-left-radius: 8px;
    border-top-right-radius: 8px;
    background-color: ${theme.colors.purple};
  }
`;

const PlayerScore = styled.h2`
  margin: 0;
  transform: translateY(-10px);

  ${theme.breakpoints.desktop} {
    margin-top: auto;
  }
`;

export const Step3 = (props: StepProps) => {
  if (props.isSpectate) return <Step3Spectate {...props} />;
  return <Step3Play {...props} />;
};

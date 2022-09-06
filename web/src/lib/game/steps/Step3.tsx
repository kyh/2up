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
import type { StepProps, GameState, Players } from "~/lib/game/steps/types";

export const Step3Play = ({ gameState, players, playerName }: StepProps) => {
  const [firstPlayer] = players;
  return (
    <>
      <QuestionNumber>
        Question: {gameState.currentScene} / {gameState.totalScenes}
      </QuestionNumber>
      <PlayerScores
        players={players}
        gameState={gameState}
        title="Scoreboard"
      />
      {firstPlayer && (
        <NextButton
          disabled={firstPlayer.name !== playerName}
          onClick={() => {
            // broadcast("scene:next")
          }}
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

export const Step3Spectate = ({ gameState, players }: StepProps) => {
  return (
    <>
      <QuestionNumber>
        Question: {gameState.currentScene} / {gameState.totalScenes}
      </QuestionNumber>
      <PlayerScores
        players={players}
        gameState={gameState}
        title="Scoreboard"
      />
    </>
  );
};

const sortByKey = (players: Players, key: "score" | "prevScore") => {
  return [...players].sort((a, b) => b[key] - a[key]);
};

export const PlayerScores = ({
  gameState,
  players,
  title,
}: {
  gameState: GameState;
  players: Players;
  title: string;
}) => {
  const desktop = useIsDesktop();
  const [isOldState, setIsOldState] = useState(true);
  const [sortedPlayers, setPlayers] = useState(sortByKey(players, "prevScore"));

  useTimeout(() => {
    setIsOldState(false);
    if (!desktop) {
      // Sort players by score if they're not on a desktop
      setPlayers(sortByKey(players, "score"));
    }
  }, 150);

  return (
    <>
      <NoScroll />
      <TitleContainer>
        <h2 className="title">{title}</h2>
      </TitleContainer>
      <PlayersContainer singleCol>
        {sortedPlayers.map(({ name, prevScore, score }) => {
          return (
            <PlayerContainer
              key={name}
              desktop={desktop}
              score={isOldState ? prevScore : score}
              totalScenes={gameState.totalScenes}
            >
              <Player playerName={name} />
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

const PlayerContainer = ({
  children,
  desktop,
  score,
  totalScenes,
}: {
  children: ReactNode;
  desktop: boolean;
  score: number;
  totalScenes: number;
}) => {
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

const maxScorePerScene = 200;
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

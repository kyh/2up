import { useState, ReactNode } from "react";
import { classed } from "~/utils/classed";
import { motion } from "framer-motion";
import { useIsDesktop } from "~/utils/useIsDesktop";
import {
  PlayersGrid,
  Player,
  NextButton,
} from "~/lib/game/components/PlayerGrid";
import { Counter } from "~/components";
import { useTimeout } from "~/utils/useTimeout";
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
          disabled={firstPlayer.name !== playerName || isLoading}
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
      <TitleContainer>
        <h2 className="m-0 text-center">{title}</h2>
      </TitleContainer>
      <PlayersContainer>
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
    <PC
      style={
        {
          "--scoreBarHeight": `${calculateScorebarHeight(score, totalScenes)}`,
          "--maxScoreHeight": `${maxScoreHeight}`,
        } as React.CSSProperties
      }
    >
      {children}
    </PC>
  );
};

const maxScoreHeight = "40vh";

const calculateScorebarHeight = (score: number, totalScenes: number) => {
  const maxScoreHeightNum = parseInt(maxScoreHeight.replace("vh", ""));
  const maxScore = totalScenes * maxScorePerScene;
  const percentage = score / maxScore;
  return `-${maxScoreHeightNum * percentage}vh`;
};

const QuestionNumber = classed.div(
  "fixed inset-x-0 top-0 brightness-[0.4] h-[50px] flex justify-center items-center pointer-events-none"
);

const TitleContainer = classed.div(
  "animate-[visible_0s_linear_0.1s_forwards] invisible mb-5 pt-[50px] text-2xl font-bold"
);

const PlayersContainer = classed(
  PlayersGrid,
  "mx-auto mb-5 max-w-[300px] desktop:mb-0 desktop:max-w-none desktop:grid-cols-3"
);

const APC = classed(motion.div, "flex justify-between items-center w-full");

const PC = classed.div(
  "flex flex-col-reverse justify-between items-center",
  "after:content-[''] after:absolute after:-bottom-[var(--maxScoreHeight)]",
  "after:h-[var(--maxScoreHeight)] after:w-full after:rounded-t-lg after:bg-purple",
  "transition-transform duration-1000 ease-[ease] translate-y-[var(--scoreBarHeight)]"
);

const PlayerScore = classed.h2(
  "m-0 translate-y-[-10px] desktop:mt-auto text-2xl font-bold"
);

export const Step3 = (props: StepProps) => {
  if (props.isSpectate) return <Step3Spectate {...props} />;
  return <Step3Play {...props} />;
};

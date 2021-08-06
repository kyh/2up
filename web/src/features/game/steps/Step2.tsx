import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import styled from "styled-components";
import { theme, useIsDesktop } from "styles/theme";
import { StepProps, GameState, SceneAnswer } from "features/game/gameSlice";
import { Instruction } from "features/game/components/Instruction";
import { Question } from "features/game/components/Question";
import { Answer } from "features/game/components/Answer";
import {
  Player,
  PlayersGrid,
  NextButton,
} from "features/game/components/PlayerGrid";
import { RawCarousel, CarouselItem, AnimationSprite } from "components";

const isCorrect = (sceneAnswer: SceneAnswer) => sceneAnswer.isCorrect;

export const Step2 = ({ gameState, broadcast, name }: StepProps) => {
  const desktop = useIsDesktop();
  const swiperRef = useRef<any>(null);
  const [showSubmissions, setShowSubmissions] = useState(false);
  const [firstPlayer] = gameState.players;
  // We only support single answers for now
  const correctAnswer = gameState.sceneAnswers?.find(isCorrect)!;

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (gameState.submissions.length > 1) {
        if (desktop) {
          setShowSubmissions(true);
        } else if (swiperRef && swiperRef.current) {
          swiperRef.current.swiper.slideTo(1);
        }
      }
    }, 2000);

    return () => {
      clearTimeout(timeoutId);
    };
  }, [swiperRef]);

  return (
    <>
      {desktop ? (
        <>
          <AnswerResult gameState={gameState} sceneAnswer={correctAnswer} />
          {showSubmissions && (
            <Submissions gameState={gameState} sceneAnswer={correctAnswer} />
          )}
        </>
      ) : (
        <RawCarousel effect="fade" ref={swiperRef}>
          <CarouselItem>
            <AnswerResult gameState={gameState} sceneAnswer={correctAnswer} />
          </CarouselItem>
          <CarouselItem>
            <Submissions gameState={gameState} sceneAnswer={correctAnswer} />
          </CarouselItem>
        </RawCarousel>
      )}
      {firstPlayer && (
        <NextButton
          disabled={firstPlayer.name !== name}
          onClick={() => broadcast("step:next")}
          autoFocus
        >
          {firstPlayer.name === name
            ? "Next"
            : `Waiting for ${firstPlayer.name}`}
        </NextButton>
      )}
    </>
  );
};

export const Step2Spectate = ({ gameState }: StepProps) => {
  const correctAnswer = gameState.sceneAnswers?.find(isCorrect)!;
  return (
    <>
      <AnswerResult gameState={gameState} sceneAnswer={correctAnswer} />
      <Submissions gameState={gameState} sceneAnswer={correctAnswer} />
    </>
  );
};

type SubmissionProps = {
  gameState: GameState;
  sceneAnswer: SceneAnswer;
};

const AnswerResult = ({ gameState }: SubmissionProps) => {
  return (
    <>
      <Instruction instruction={gameState.instruction} />
      <Question
        question={gameState.question}
        questionType={gameState.questionType}
      />
      {gameState.sceneAnswers?.map((sceneAnswer) => (
        <Answer
          key={sceneAnswer.id}
          sceneAnswer={sceneAnswer}
          answerType={gameState.answerType}
          onSubmit={() => {}}
          submitted
          displayMode
        />
      ))}
    </>
  );
};

const Submissions = ({ gameState, sceneAnswer }: SubmissionProps) => {
  const players = gameState.submissions.map((submission) => {
    const isCorrect =
      submission.content.trim().toLowerCase() ===
      sceneAnswer.content.trim().toLowerCase();
    return (
      <Player
        key={submission.name}
        playerName={submission.name}
        playerContent={`: "${submission.content}"`}
      >
        {isCorrect && (
          <>
            <div className="correct">
              <Image
                src="/illustrations/correct.svg"
                alt="Correct answer"
                width="50"
                height="70"
              />
            </div>
            <Stars name="blinkingStars2" />
          </>
        )}
      </Player>
    );
  });

  return <SubmissionsContainer>{players}</SubmissionsContainer>;
};

const SubmissionsContainer = styled(PlayersGrid)`
  padding: ${theme.spacings(20)} 0 ${theme.spacings(5)};
  .correct {
    position: absolute;
    top: ${theme.spacings(-3)};
    left: 0;
  }
  .name {
    text-align: center;
  }
  ${theme.breakpoints.desktop} {
    padding: 0 ${theme.spacings(5)};
  }
`;

const Stars = styled(AnimationSprite)`
  top: 40px;
  left: 50%;
  transform: translate(-50%, -50%) scale(0.5);
  ${theme.breakpoints.desktop} {
    top: 20px;
  }
`;

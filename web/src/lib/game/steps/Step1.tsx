import { useRef, useState } from "react";
import { classed } from "@tw-classed/react";
import { Alert, Timer } from "~/components";
import { Instruction } from "~/lib/game/components/Instruction";
import { Question } from "~/lib/game/components/Question";
import { Answer } from "~/lib/game/components/Answer";
import { useSubmitAnswer } from "~/lib/game/useGameActions";
import type { StepProps } from "~/lib/game/steps/types";

const Step1Play = ({
  gameId,
  gameState,
  players,
  playerId,
  playerName,
}: StepProps) => {
  const [submitted, setSubmitted] = useState(false);
  const initialSecondsRef = useRef(
    Math.round(
      (gameState.duration * 1000 - (gameState.startTime - Date.now())) / 1000
    )
  );
  const { submitAnswer } = useSubmitAnswer();

  const submissions = gameState.submissions.length;
  const waiting = players.length - submissions - 1;

  const onSubmit = (
    submission: Pick<StepProps["gameState"]["submissions"][0], "content"> = {
      content: "",
    }
  ) => {
    if (submitted) return;
    setSubmitted(true);
    submitAnswer(gameId, players.length, {
      ...submission,
      playerId,
      playerName,
    });
  };

  return (
    <>
      {submitted && !!waiting && <Alert>Waiting for {waiting} players</Alert>}
      <Instruction instruction={gameState.questionDescription} />
      <Question
        question={gameState.question}
        questionType={gameState.questionType}
      />
      {gameState.sceneAnswers?.map((sceneAnswer) => (
        <Answer
          key={sceneAnswer.id}
          sceneAnswer={sceneAnswer}
          answerType={gameState.answerType}
          submitted={submitted}
          onSubmit={onSubmit}
        />
      ))}
      <Timer
        shouldCallTimeout={!submitted}
        onTimeout={onSubmit}
        initialSeconds={initialSecondsRef.current}
      />
    </>
  );
};

const Step1Spectate = ({ gameState }: StepProps) => {
  const submissions = gameState.submissions.length - 1;
  return (
    <>
      {!!submissions && (
        <Alert>{submissions} players have submitted their answers</Alert>
      )}
      <SpectateConatiner>
        <Instruction instruction={gameState.questionDescription} />
        <Question
          question={gameState.question}
          questionType={gameState.questionType}
        />
      </SpectateConatiner>
      <Timer shouldCallTimeout={false} />
    </>
  );
};

const SpectateConatiner = classed.div(
  "max-w-[600px] leading-[1.3] translate-y-[-100px] text-center"
);

export const Step1 = (props: StepProps) => {
  if (props.isSpectate) return <Step1Spectate {...props} />;
  return <Step1Play {...props} />;
};

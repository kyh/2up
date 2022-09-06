import { useState } from "react";
import styled from "styled-components";
import { Alert, Timer } from "~/components";
import { Instruction } from "~/lib/game/components/Instruction";
import { Question } from "~/lib/game/components/Question";
import { Answer } from "~/lib/game/components/Answer";
import type { StepProps } from "~/lib/game/steps/types";

const Step1Play = ({ gameState, players }: StepProps) => {
  const [submitted, setSubmitted] = useState(false);

  const submissions = gameState.submissions.length;
  const waiting = players.length - submissions;

  const onSubmit = (
    submission: Pick<Submission, "content"> = { content: "" }
  ) => {
    if (submitted) return;
    setSubmitted(true);
    // broadcast("submit", {
    //   name,
    //   submission: {
    //     ...submission,
    //     name,
    //   },
    // });
  };

  return (
    <>
      {submitted && <Alert>Waiting for {waiting} players</Alert>}
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
        initialSeconds={gameState.duration}
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

const SpectateConatiner = styled.div`
  max-width: 600px;
  line-height: 1.3;
  transform: translateY(-100px);
  text-align: center;
`;

export const Step1 = (props: StepProps) => {
  if (props.isSpectate) return <Step1Spectate {...props} />;
  return <Step1Play {...props} />;
};

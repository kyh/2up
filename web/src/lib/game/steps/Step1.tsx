import { useState } from "react";
import styled from "styled-components";
import { Alert, Timer } from "~/components";
import { Submission, StepProps } from "~/lib/game/gameSlice";
import { Instruction } from "~/lib/game/components/Instruction";
import { Question } from "~/lib/game/components/Question";
import { Answer } from "~/lib/game/components/Answer";

export const Step1 = ({ gameState, broadcast, name }: StepProps) => {
  const [submitted, setSubmitted] = useState(false);

  const submissions = gameState.submissions.length;
  const players = gameState.players.length;
  const waiting = players - submissions;

  const onSubmit = (
    submission: Pick<Submission, "content"> = { content: "" }
  ) => {
    if (submitted) return;
    setSubmitted(true);
    broadcast("submit", {
      name,
      submission: {
        ...submission,
        name,
      },
    });
  };

  return (
    <>
      {submitted && <Alert>Waiting for {waiting} players</Alert>}
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
          submitted={submitted}
          onSubmit={onSubmit}
        />
      ))}
      <Timer
        shouldCallTimeout={!submitted}
        onTimeout={onSubmit}
        initialSeconds={gameState.durationInSeconds}
      />
    </>
  );
};

export const Step1Spectate = ({ gameState }: StepProps) => {
  const submissions = gameState.submissions.length - 1;
  return (
    <>
      {!!submissions && (
        <Alert>{submissions} players have submitted their answers</Alert>
      )}
      <SpectateConatiner>
        <Instruction instruction={gameState.instruction} />
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

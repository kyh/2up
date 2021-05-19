import { useState } from "react";
import styled from "styled-components";
import { Alert, Timer } from "components";
import { StepProps } from "features/game/gameSlice";
import { Question } from "features/game/components/Question";
import { Answer } from "features/game/components/Answer";

export const Step1 = ({ state, broadcast, userId, name }: StepProps) => {
  const [submitted, setSubmitted] = useState(false);

  const submissions = state.submissions.length;
  const players = state.players.length;
  const waiting = players - submissions;

  const onSubmit = (value = "") => {
    if (submitted) return;
    setSubmitted(true);
    broadcast("submit", {
      userId,
      name,
      submission: value,
    });
  };

  return (
    <Container>
      {submitted && <Alert>Waiting for {waiting} players</Alert>}
      <Question
        question={state.question}
        instruction={state.instruction}
        questionType={state.questionType}
      />
      {state.sceneAnswers?.map((sceneAnswer) => (
        <Answer
          key={sceneAnswer.id}
          sceneAnswer={sceneAnswer}
          answerType={state.answerType}
          submitted={submitted}
          onSubmit={onSubmit}
        />
      ))}
      <Timer shouldCallTimeout={!submitted} onTimeout={onSubmit} />
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
  height: 100%;
`;

export const Step1Spectate = ({ state }: StepProps) => {
  const submissions = state.submissions.length - 1;
  return (
    <>
      {!!submissions && (
        <Alert>{submissions} players have submitted their answers</Alert>
      )}
      <SpectateConatiner>
        <Question
          question={state.question}
          instruction={state.instruction}
          questionType={state.questionType}
        />
      </SpectateConatiner>
      <Timer />
    </>
  );
};

const SpectateConatiner = styled.div`
  max-width: 600px;
  line-height: 1.3;
  transform: translateY(-100px);
  text-align: center;
`;

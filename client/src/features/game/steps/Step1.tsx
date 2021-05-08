import { useState } from "react";
import { Alert, Flex, Timer } from "components";
import { StepProps } from "features/game/gameSlice";
import {
  TVQuestionConatiner,
  Question,
} from "features/game/components/Question";
import { Answer } from "features/game/components/Answer";

export const Step1 = ({ state, broadcast, userId, name }: StepProps) => {
  const [submitted, setSubmitted] = useState(false);

  const submissions = state.submissions.length - 1;
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
    <Flex alignItems="center" flexDirection="column">
      {submitted && <Alert>Waiting for {waiting} players</Alert>}
      <Question
        question={state.question}
        instruction={state.instruction}
        questionType={state.questionType}
      />
      <Answer
        answer={state.answer}
        answerType={state.answerType}
        submitted={submitted}
        onSubmit={onSubmit}
      />
      <Timer shouldCallTimeout={!submitted} onTimeout={onSubmit} />
    </Flex>
  );
};

export const Step1Spectate = ({ state }: StepProps) => {
  const submissions = state.submissions.length - 1;
  return (
    <>
      {!!submissions && (
        <Alert>{submissions} players have submitted their answers</Alert>
      )}
      <TVQuestionConatiner>
        <Question
          question={state.question}
          instruction={state.instruction}
          questionType={state.questionType}
        />
      </TVQuestionConatiner>
      <Timer />
    </>
  );
};

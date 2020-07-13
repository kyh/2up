import React, { useState } from "react";
import { Alert, Timer } from "components";
import { StepProps } from "features/game/gameSlice";
import {
  TVQuestionConatiner,
  Question,
} from "features/game/components/Question";
import { SubmissionsContainer } from "features/game/components/SubmissionsContainer";
import { Answer } from "features/game/components/Answer";

export const Step2Remote = ({ state, broadcast, userId, name }: StepProps) => {
  const [submitted, setSubmitted] = useState(false);

  const submissions = state.submissions.reduce((sum, s) => {
    return (sum += s.endorsers.length);
  }, 0);
  const players = state.players.length;
  const waiting = players - submissions;

  const endorse = (submissionId: number) => {
    broadcast("endorse", {
      userId,
      name,
      submission_id: submissionId,
    });
    setSubmitted(true);
  };

  return (
    <>
      {submitted && <Alert>Waiting for {waiting} players</Alert>}
      <section>
        <Question
          question={state.question}
          instruction={state.instruction}
          questionType={state.questionType}
        />
        {state.submissions.map((submission) => {
          if (!submission.content) return null;
          return (
            <Answer
              key={submission.id}
              answerType={`endorse_${state.answerType}`}
              answer={submission.content}
              onSubmit={() => endorse(submission.id)}
              submitted={submitted}
            />
          );
        })}
        <Timer
          shouldCallTimeout={!submitted}
          onTimeout={() => {
            const submission =
              state.submissions[
                Math.floor(Math.random() * state.submissions.length)
              ];
            endorse(submission.id);
          }}
        />
      </section>
    </>
  );
};

export const Step2TV = ({ state }: StepProps) => {
  const submissions = state.submissions.reduce((sum, s) => {
    return (sum += s.endorsers.length);
  }, 0);
  return (
    <section>
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
      <SubmissionsContainer>
        {state.submissions.map((submission) => {
          if (!submission.content) return null;
          return (
            <div className="submission" key={submission.id}>
              <Answer
                answerType={`endorse_${state.answerType}`}
                answer={submission.content}
                onSubmit={() => {}}
                submitted
              />
            </div>
          );
        })}
        <Timer />
      </SubmissionsContainer>
    </section>
  );
};

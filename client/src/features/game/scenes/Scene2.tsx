import React, { useState } from 'react';
import styled from 'styled-components';
import { Alert, Timer, Button } from 'components';
import { SceneProps } from 'features/game/gameSlice';
import {
  TVQuestionConatiner,
  Question
} from 'features/game/components/Question';
import { SubmissionsContainer } from 'features/game/components/SubmissionsContainer';

export const Scene2Remote = ({
  state,
  broadcast,
  userId,
  name
}: SceneProps) => {
  const [submitted, setSubmitted] = useState(false);

  const submissions = state.submissions.reduce((sum, s) => {
    return (sum += s.endorsers.length);
  }, 0);
  const players = state.players.length;
  const waiting = players - submissions;

  const endorse = (submissionId: number) => {
    broadcast('endorse', {
      userId,
      name,
      submission_id: submissionId
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
        {state.submissions.map(submission => {
          if (!submission.content) return null;
          return (
            <EndorsementButtons
              key={submission.id}
              disabled={submitted}
              onClick={() => endorse(submission.id)}
            >
              {submission.content}
            </EndorsementButtons>
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

const EndorsementButtons = styled(Button)`
  display: block;
  width: 100%;
  text-transform: uppercase;
`;

export const Scene2TV = ({ state }: SceneProps) => {
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
        {state.submissions.map(submission => {
          if (!submission.content) return null;
          return (
            <div className="submission" key={submission.id}>
              <Button disabled>{submission.content}</Button>
            </div>
          );
        })}
        <Timer />
      </SubmissionsContainer>
    </section>
  );
};

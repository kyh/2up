import React, { useState } from 'react';
import styled from 'styled-components';
import { Timer, Button } from 'components';
import { SceneProps } from 'features/trivia/triviaSlice';

import { Question } from '../components/Question';
import { SubmissionsContainer } from '../components/SubmissionsContainer';

export const Scene2Remote = ({ state, broadcast }: SceneProps) => {
  const [submitted, setSubmitted] = useState(false);

  const endorse = (submissionId: number) => {
    broadcast('endorse', {
      name: localStorage.getItem('name'),
      submission_id: submissionId
    });
    setSubmitted(true);
  };

  return (
    <section>
      <h2>{state.question}</h2>
      {state.submissions.map(submission => {
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
        initialSeconds={30}
        onTimeout={() => {
          const submission =
            state.submissions[
              Math.floor(Math.random() * state.submissions.length)
            ];
          endorse(submission.id);
        }}
      />
    </section>
  );
};

const EndorsementButtons = styled(Button)`
  text-transform: uppercase;
`;

export const Scene2TV = ({ state }: SceneProps) => {
  return (
    <section>
      <Question>{state.question}</Question>
      <SubmissionsContainer>
        {state.submissions.map(submission => {
          return (
            <div className="submission" key={submission.id}>
              <Button disabled>{submission.content}</Button>
            </div>
          );
        })}
        <Timer initialSeconds={30} />
      </SubmissionsContainer>
    </section>
  );
};

import React, { useState } from 'react';
import styled from 'styled-components';
import { Button } from 'components';
import { SceneProps } from 'features/trivia/triviaSlice';

import { Question } from '../components/Question';
import { SubmissionsContainer } from '../components/SubmissionsContainer';

export const Scene2Remote = ({ state, broadcast }: SceneProps) => {
  const [submitted, setSubmitted] = useState(false);
  return (
    <section>
      <h2>{state.question}</h2>
      {state.submissions.map(submission => {
        return (
          <EndorsementButtons
            key={submission.id}
            disabled={submitted}
            onClick={() => {
              broadcast('endorse', {
                name: localStorage.getItem('name'),
                submission_id: submission.id
              });
              setSubmitted(true);
            }}
          >
            {submission.content}
          </EndorsementButtons>
        );
      })}
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
      </SubmissionsContainer>
    </section>
  );
};

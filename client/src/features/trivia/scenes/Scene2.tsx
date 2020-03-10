import React, { useState } from 'react';
import styled from 'styled-components';
import { Timer, Button } from 'components';
import { SceneProps } from 'features/trivia/triviaSlice';
import {
  TVQuestionConatiner,
  Question
} from 'features/trivia/components/Question';
import { SubmissionsContainer } from 'features/trivia/components/SubmissionsContainer';

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
      <Question>{state.question}</Question>
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
  );
};

const EndorsementButtons = styled(Button)`
  display: block;
  width: 100%;
  text-transform: uppercase;
`;

export const Scene2TV = ({ state }: SceneProps) => {
  return (
    <section>
      <TVQuestionConatiner>
        <Question>{state.question}</Question>
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

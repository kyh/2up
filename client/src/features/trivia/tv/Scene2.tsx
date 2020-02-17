import React from 'react';
import { SceneProps } from 'features/trivia/TriviaContext';
import { Button } from 'components';
import { Question } from '../components/Question';
import { SubmissionsContainer } from '../components/SubmissionsContainer';

export const Scene2 = ({ state }: SceneProps) => {
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

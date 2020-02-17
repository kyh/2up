import React from 'react';
import { SceneProps } from 'features/trivia/TriviaContext';
import { Question } from '../components/Question';
import { SubmissionCountBox } from '../components/SubmissionCountBox';

export const Scene1 = ({ state }: SceneProps) => {
  const submissions = state.submissions.length - 1;
  return (
    <>
      {!!submissions && (
        <SubmissionCountBox>
          {submissions} players have submitted their answers
        </SubmissionCountBox>
      )}
      <Question>{state.question}</Question>
    </>
  );
};

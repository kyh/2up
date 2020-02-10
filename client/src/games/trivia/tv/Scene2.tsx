import React from 'react';
import styled from 'styled-components';
import { SceneProps } from 'games/trivia/TriviaContext';
import { Question } from '../components/Question';
import { SubmissionsContainer } from '../components/SubmissionsContainer';

export const Scene2 = ({ state }: SceneProps) => {
  return (
    <>
      <Question>{state.question}</Question>
      <SubmissionsContainer>
        {state.submissions.map(submission => {
          return <div key={submission.id}>{submission.content}</div>;
        })}
      </SubmissionsContainer>
    </>
  );
};

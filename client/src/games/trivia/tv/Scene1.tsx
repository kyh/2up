import React from 'react';
import styled from 'styled-components';
import { SceneProps } from 'games/trivia/TriviaContext';
import { Question } from '../components/Question';

export const Scene1 = ({ state }: SceneProps) => {
  const submissions = state.submissions.length - 1;
  return (
    <>
      {!!submissions && (
        <SubmissionBox>
          {submissions} players have submitted their answers
        </SubmissionBox>
      )}
      <Question>{state.question}</Question>
    </>
  );
};

const SubmissionBox = styled.div`
  position: absolute;
  top: ${({ theme }) => theme.spacings(3)};
  color: ${({ theme }) => theme.colors.white};
  background: ${({ theme }) => theme.colors.black};
  padding: ${({ theme }) => theme.spacings(3)};
  border-radius: 30px 2px 30% 3px / 4px 10px 3px 30px;
`;

import React from 'react';
import styled from 'styled-components';

type Props = {
  instruction?: string;
  question?: string;
  questionType?: string;
};

export const Question: React.FC<Props> = ({
  instruction,
  question,
  questionType
}) => {
  switch (questionType) {
    case 'image':
      return (
        <>
          <QuestionInstructions>{instruction}</QuestionInstructions>
          <QuestionImage alt={instruction} src={question} />
        </>
      );
    default:
      return (
        <>
          <QuestionInstructions>{instruction}</QuestionInstructions>
          <QuestionText>{question}</QuestionText>
        </>
      );
  }
};

export const QuestionInstructions = styled.div`
  text-align: center;
  margin: 0 0 ${({ theme }) => theme.spacings(2)};
`;

export const QuestionText = styled.h1`
  text-align: center;
  margin: 0 0 ${({ theme }) => theme.spacings(5)};
`;

export const QuestionImage = styled.img`
  margin: 0 0 ${({ theme }) => theme.spacings(5)};
`;

export const TVQuestionConatiner = styled.div`
  max-width: 600px;
  line-height: 1.3;
  transform: translateY(-100px);
  text-align: center;
`;

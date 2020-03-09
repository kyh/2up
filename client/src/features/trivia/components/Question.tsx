import styled from 'styled-components';

export const Question = styled.h1`
  margin: 0 0 ${({ theme }) => theme.spacings(5)};
`;

export const TVQuestionConatiner = styled.div`
  max-width: 600px;
  line-height: 1.3;
  transform: translateY(-100px);
  text-align: center;
`;

export const QuestionInstructions = styled.div`
  margin: 0 0 ${({ theme }) => theme.spacings(2)};
`;

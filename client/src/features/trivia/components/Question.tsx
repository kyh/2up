import styled from 'styled-components';

export const Question = styled.h1`
  max-width: 600px;
  line-height: 1.3;
  margin: 0 0 ${({ theme }) => theme.spacings(3)};
  transform: translateY(-30px);
`;

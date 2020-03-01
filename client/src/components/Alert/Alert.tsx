import styled from 'styled-components';

export const Alert = styled.div`
  position: absolute;
  top: ${({ theme }) => theme.spacings(3)};
  color: ${({ theme }) => theme.colors.white};
  background: ${({ theme }) => theme.colors.black};
  padding: ${({ theme }) => theme.spacings(3)};
  border-radius: 30px 2px 30% 3px / 4px 10px 3px 30px;
`;

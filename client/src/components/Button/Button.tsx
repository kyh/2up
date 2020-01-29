import styled from 'styled-components/macro';
import border from './border.svg';
import borderActive from './border-active.svg';

export const Button = styled.button`
  padding: ${({ theme }) => theme.spacings(4)};
  border-image-slice: 4 4 3 5 fill;
  border-image-width: 5px;
  border-image-outset: 0;
  border-image-repeat: stretch stretch;
  border-image-source: url(${border});
  transition: filter 0.2s ease;
  &:hover {
    filter: invert(1) brightness(0.4);
  }
  &:active {
    border-image-source: url(${borderActive});
  }
`;

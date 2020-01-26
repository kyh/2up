import styled from 'styled-components/macro';
import border from './border.svg';
import borderHover from './border-hover.svg';

export const Button = styled.button`
  padding: ${({ theme }) => theme.spacings(4)};
  border-image-slice: 4 4 3 5 fill;
  border-image-width: 5px;
  border-image-outset: 0;
  border-image-repeat: stretch stretch;
  border-image-source: url(${border});
  transition: filter 0.1s ease;
  &:hover {
    filter: invert(0.5) sepia(1) saturate(3.4) hue-rotate(200deg)
      brightness(0.8);
  }
  &:active {
    border-image-source: url(${borderHover});
  }
`;

import styled, { css } from 'styled-components/macro';
import border from './border.svg';
import borderRounded from './border-rounded.svg';

enum Variants {
  default = 'default',
  rounded = 'rounded'
}

type Props = {
  variant?: keyof typeof Variants;
};

const renderRegularStyles = () => {
  return css`
    border-image-slice: 4 4 3 5 fill;
    border-image-width: 5px;
    border-image-outset: 0;
    border-image-repeat: stretch stretch;
    border-image-source: url(${border});
  `;
};

const renderRoundedStyles = () => {
  return css`
    padding: ${({ theme }) => `${theme.spacings(4)} ${theme.spacings(6)}`};
    border-image-slice: 3 1 3 1 fill;
    border-image-width: 5px;
    border-image-outset: 0;
    border-image-repeat: stretch stretch;
    border-image-source: url(${borderRounded});
  `;
};

export const Input = styled.input<Props>`
  padding: ${({ theme }) => theme.spacings(4)};
  ${({ variant = Variants.default }) =>
    variant === Variants.default
      ? renderRegularStyles()
      : renderRoundedStyles()}

  &:focus {
    outline: none;
  }
`;

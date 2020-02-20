import styled, { css } from 'styled-components';
import { border, borderRounded } from './borders';

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
    border-image-source: ${({ theme }) =>
      `url("${border(theme.ui.button.border)}")`};
  `;
};

const renderRoundedStyles = () => {
  return css`
    padding: ${({ theme }) => `${theme.spacings(4)} ${theme.spacings(6)}`};
    border-image-slice: 3 1 3 1 fill;
    border-image-width: 5px;
    border-image-outset: 0;
    border-image-repeat: stretch stretch;
    border-image-source: ${({ theme }) =>
      `url("${borderRounded(theme.ui.button.border)}")`};
  `;
};

export const Input = styled.input<Props>`
  padding: ${({ theme }) => theme.spacings(4)};
  color: ${({ theme }) => theme.ui.button.color};
  background-color: ${({ theme }) => theme.ui.button.background};
  ${({ variant = Variants.default }) =>
    variant === Variants.default
      ? renderRegularStyles()
      : renderRoundedStyles()}

  &:focus {
    outline: none;
  }

  &:read-only {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

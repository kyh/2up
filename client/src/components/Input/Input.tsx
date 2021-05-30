import styled, { css } from "styled-components";
import { theme, getComputedBorder } from "styles/theme";
import { border, borderRounded } from "./borders";

enum Variants {
  default = "default",
  rounded = "rounded",
}

type Props = {
  variant?: keyof typeof Variants;
  fullWidth?: boolean;
};

const renderRegularStyles = () => {
  return css`
    border-image-slice: 4 4 3 5 fill;
    border-image-width: 5px;
    border-image-outset: 0;
    border-image-repeat: stretch stretch;
    border-image-source: ${({ theme: { isDarkMode } }) =>
      `url("${border(getComputedBorder(isDarkMode))}")`};
  `;
};

const renderRoundedStyles = () => {
  return css`
    padding: ${theme.spacings(4)} ${theme.spacings(6)};
    border-image-slice: 3 1 3 1 fill;
    border-image-width: 5px;
    border-image-outset: 0;
    border-image-repeat: stretch stretch;
    border-image-source: url("${borderRounded(theme.ui.buttonBorder)}");
  `;
};

export const Input = styled.input<Props>`
  padding: ${theme.spacings(4)};
  color: ${theme.ui.buttonText};
  background-color: ${theme.ui.buttonBackground};
  width: ${({ fullWidth }) => (fullWidth ? "100%" : "auto")};
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

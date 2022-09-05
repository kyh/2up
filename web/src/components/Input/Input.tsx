import styled, { css } from "styled-components";
import { theme } from "~/styles/theme";

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
    border-image-source: ${theme.ui.inputBorderUrl};
  `;
};

const renderRoundedStyles = () => {
  return css`
    padding: ${theme.spacings(4)} ${theme.spacings(6)};
    border-image-slice: 3 1 3 1 fill;
    border-image-width: 5px;
    border-image-outset: 0;
    border-image-repeat: stretch stretch;
    border-image-source: ${theme.ui.inputBorderRoundedUrl};
  `;
};

export const Input = styled.input<Props>`
  padding: 0 ${theme.spacings(4)};
  line-height: 50px;
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
    filter: brightness(0.5);
    cursor: not-allowed;
  }
`;

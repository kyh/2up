import { ReactNode } from "react";
import { Link } from "react-router-dom";
import styled, {
  css,
  StyledComponentProps,
  DefaultTheme,
} from "styled-components";
import { useAppSelector } from "app/hooks";
import { clickSound } from "styles/sound";
import { border, borderActive, fabBorder, fabBorderActive } from "./borders";

enum Variants {
  default = "default",
  fab = "fab",
}

type Props = StyledComponentProps<
  "button",
  DefaultTheme,
  {
    variant?: keyof typeof Variants;
    fullWidth?: boolean;
    onClick?: () => void;
    children?: ReactNode;
  } & StyledProps,
  never
>;

export const Button = ({ onClick = () => {}, ...rest }: Props) => {
  const isSFXOn = useAppSelector((state) => state.playhouse.isSFXOn);

  const onButtonClick = () => {
    if (isSFXOn) clickSound.play();
    onClick();
  };

  return <StyledButton type="button" onClick={onButtonClick} {...rest} />;
};

type StyledProps = {
  fullWidth?: boolean;
  variant?: keyof typeof Variants;
};

const renderRegularStyles = () => {
  return css`
    transition: transform 0.2s ease;
    padding: ${({ theme }) => theme.spacings(4)};
    border-image-slice: 4 4 3 5 fill;
    border-image-width: 5px;
    border-image-outset: 0;
    border-image-repeat: stretch stretch;
    border-image-source: ${({ theme }) =>
      `url("${border(theme.ui.button.border)}")`};
    min-width: 100px;
    &:hover {
      border-image-source: ${({ theme }) =>
        `url("${borderActive(theme.ui.button.border)}")`};
    }
    &:active {
      transform: scale(0.9);
      border-image-source: ${({ theme }) =>
        `url("${borderActive(theme.ui.button.border)}")`};
    }
    &:disabled {
      opacity: 0.5;
      cursor: not-allowed;
      &:hover {
        border-image-source: ${({ theme }) =>
          `url("${border(theme.ui.button.border)}")`};
      }
    }
  `;
};

const renderFabStyles = () => {
  return css`
    transition: transform 0.2s ease;
    padding: ${({ theme }) => theme.spacings(1)};
    background-repeat: no-repeat;
    background-size: contain;
    background-image: ${({ theme }) =>
      `url("data:image/svg+xml,${fabBorder(theme.ui.button.border)}")`};
    &:hover {
      background-image: ${({ theme }) =>
        `url("data:image/svg+xml,${fabBorderActive(theme.ui.button.border)}")`};
    }
    &:active {
      transform: scale(0.9);
      background-image: ${({ theme }) =>
        `url("data:image/svg+xml,${fabBorderActive(theme.ui.button.border)}")`};
    }
    &:disabled {
      opacity: 0.5;
      cursor: not-allowed;
      &:hover {
        background-image: ${({ theme }) =>
          `url("data:image/svg+xml,${fabBorder(theme.ui.button.border)}")`};
      }
    }
  `;
};

export const StyledButton = styled.button<StyledProps>`
  width: ${({ fullWidth }) => (fullWidth ? "100%" : "auto")};
  ${({ variant = Variants.default }) =>
    variant === Variants.default ? renderRegularStyles() : renderFabStyles()}
`;

export const ButtonLink = styled.a<StyledProps>`
  text-align: center;
  width: ${({ fullWidth }) => (fullWidth ? "100%" : "auto")};
  ${({ variant = Variants.default }) =>
    variant === Variants.default ? renderRegularStyles() : renderFabStyles()}
`;

export const ButtonLinkNative = styled(Link)`
  ${renderRegularStyles()}
`;

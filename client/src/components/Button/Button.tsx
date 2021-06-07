import { ReactNode } from "react";
import { Link } from "react-router-dom";
import styled, {
  css,
  StyledComponentProps,
  DefaultTheme,
} from "styled-components";
import { useAppSelector } from "app/hooks";
import { theme } from "styles/theme";
import { bounceExpand, bounceContract } from "styles/animations";
import { clickSound } from "styles/sound";

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
    padding: ${theme.spacings(4)};
    border-image-slice: 4 4 3 5 fill;
    border-image-width: 5px;
    border-image-outset: 0;
    border-image-repeat: stretch stretch;
    border-image-source: ${theme.ui.buttonBorderUrl};
    min-width: 100px;
    animation: ${bounceContract} 1s;
    &:hover {
      animation: ${bounceExpand} 1s;
      animation-fill-mode: forwards;
      border-image-source: ${theme.ui.buttonBorderActiveUrl};
    }
    &:active {
      animation: ${bounceContract} 1s;
      border-image-source: ${theme.ui.buttonBorderActiveUrl};
    }
    &:disabled {
      opacity: 0.5;
      cursor: not-allowed;
      animation: none;
      &:hover {
        animation: none;
        border-image-source: ${theme.ui.buttonBorderUrl};
      }
    }
  `;
};

const renderFabStyles = () => {
  return css`
    transition: transform 0.2s ease;
    padding: ${theme.spacings(1)};
    background-repeat: no-repeat;
    background-size: contain;
    background-image: ${theme.ui.buttonFabBorderUrl};
    animation: ${bounceContract} 1s;
    &:hover {
      animation: ${bounceExpand} 1s;
      animation-fill-mode: forwards;
      background-image: ${theme.ui.buttonFabBorderActiveUrl};
    }
    &:active {
      animation: ${bounceContract} 1s;
      background-image: ${theme.ui.buttonFabBorderActiveUrl};
    }
    &:disabled {
      opacity: 0.5;
      cursor: not-allowed;
      &:hover {
        background-image: ${theme.ui.buttonFabBorderUrl};
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

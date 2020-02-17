import React from 'react';
import { useSelector } from 'react-redux';
import styled, {
  css,
  StyledComponentProps,
  DefaultTheme
} from 'styled-components';
import { RootState } from 'redux/rootReducer';
import { clickSound } from 'styles/sound';
import { border, borderActive, fabBorder, fabBorderActive } from './borders';

enum Variants {
  default = 'default',
  fab = 'fab'
}

type Props = StyledComponentProps<
  'button',
  DefaultTheme,
  {
    variant?: keyof typeof Variants;
    fullWidth?: boolean;
    onClick?: () => void;
    children?: React.ReactNode;
  } & StyledProps,
  never
>;

export const Button: React.FC<Props> = ({ onClick = () => {}, ...rest }) => {
  const { isSFXOn } = useSelector((state: RootState) => state.app);
  const onButtonClick = () => {
    if (isSFXOn) {
      clickSound.play();
    }
    onClick();
  };
  return <StyledButton onClick={onButtonClick} {...rest} />;
};

type StyledProps = {
  fullWidth?: boolean;
  variant?: keyof typeof Variants;
};

const renderRegularStyles = () => {
  return css`
    padding: ${({ theme }) => theme.spacings(4)};
    border-image-slice: 4 4 3 5 fill;
    border-image-width: 5px;
    border-image-outset: 0;
    border-image-repeat: stretch stretch;
    border-image-source: url("${border}");
    min-width: 100px;
    &:hover {
      border-image-source: url("${borderActive}");
    }
    &:active {
      transform: scale(0.9);
      border-image-source: url("${borderActive}");
    }
    &:disabled {
      opacity: 0.5;
      cursor: not-allowed;
      &:hover {
        border-image-source: url("${border}");
      }
    }
  `;
};

const renderFabStyles = () => {
  return css`
    padding: ${({ theme }) => theme.spacings(1)};
    background-repeat: no-repeat;
    background-size: contain;
    background-image: url("data:image/svg+xml,${fabBorder}");
    &:hover {
      background-image: url("data:image/svg+xml,${fabBorderActive}");
    }
    &:active {
      transform: scale(0.9);
      background-image: url("data:image/svg+xml,${fabBorderActive}");
    }
    &:disabled {
      opacity: 0.5;
      cursor: not-allowed;
      &:hover {
        background-image: url("data:image/svg+xml,${fabBorder}");
      }
    }
  `;
};

export const StyledButton = styled.button<StyledProps>`
  transition: transform 0.2s ease;
  width: ${({ fullWidth }) => (fullWidth ? '100%' : 'auto')};
  ${({ variant = Variants.default }) =>
    variant === Variants.default ? renderRegularStyles() : renderFabStyles()}
`;

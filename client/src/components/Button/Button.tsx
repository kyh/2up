import React from 'react';
import styled, {
  StyledComponentProps,
  DefaultTheme
} from 'styled-components/macro';
import UIfx from 'uifx';
import { SoundMap } from 'styles/sounds';
import border from './border.svg';
import borderActive from './border-active.svg';

const clickSound = new UIfx(SoundMap.click);

type Props = StyledComponentProps<
  'button',
  DefaultTheme,
  {
    onClick?: () => void;
    children?: React.ReactNode;
  },
  never
>;

export const Button: React.FC<Props> = ({ onClick = () => {}, ...rest }) => {
  const onButtonClick = () => {
    clickSound.play();
    onClick();
  };
  return <StyledButton onClick={onButtonClick} {...rest} />;
};

export const StyledButton = styled.button`
  padding: ${({ theme }) => theme.spacings(4)};
  border-image-slice: 4 4 3 5 fill;
  border-image-width: 5px;
  border-image-outset: 0;
  border-image-repeat: stretch stretch;
  border-image-source: url(${border});
  transition: transform 0.2s ease;
  &:hover {
    border-image-source: url(${borderActive});
  }
  &:active {
    transform: scale(0.9);
    border-image-source: url(${borderActive});
  }
`;

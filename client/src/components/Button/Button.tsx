import React from 'react';
import styled from 'styled-components/macro';
import UIfx from 'uifx';
import { SoundMap } from 'styles/sounds';
import border from './border.svg';
import borderActive from './border-active.svg';

const clickSound = new UIfx(SoundMap.click);

type Props = {
  onClick?: () => void;
  children?: React.ReactNode;
};

export const Button = ({ onClick = () => {}, ...rest }: Props) => {
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
  transition: filter 0.2s ease;
  &:hover {
    filter: invert(1) brightness(0.4);
  }
  &:active {
    border-image-source: url(${borderActive});
  }
`;

import { DefaultTheme } from 'styled-components';
import { memoize } from 'lodash';

const SPACING_UNIT = 4;
const calculateSpacing = (n: number): string => {
  return `${n * SPACING_UNIT}px`;
};

export const theme: DefaultTheme = {
  colors: {
    black: '#1A1919',
    lightGrey: '#cecece',
    white: '#FFFFFF',
    purple: '#7247C4'
  },
  space: [0, 4, 8, 16, 32, 64, 128, 256, 512],
  spacings: memoize(calculateSpacing)
};

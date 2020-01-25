import { DefaultTheme } from 'styled-components';
import { memoize } from 'lodash';

const SPACING_UNIT = 4;
const calculateSpacing = (n: number): string => {
  return `${n * SPACING_UNIT}px`;
};

export const theme: DefaultTheme = {
  colors: {
    black: '#1A1919',
    white: '#FFFFFF'
  },
  spacings: memoize(calculateSpacing)
};

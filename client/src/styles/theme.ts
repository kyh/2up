import { DefaultTheme } from 'styled-components';
import { memoize } from 'lodash';

const SPACING_UNIT = 4;
const calculateSpacing = (n: number): string => {
  return `${n * SPACING_UNIT}px`;
};

export const theme: DefaultTheme = {
  typography: {
    h1: {
      fontSize: '40px',
      lineHeight: '48px'
    },
    h2: {
      fontSize: '32px',
      lineHeight: '36px'
    },
    h3: {
      fontSize: '18px',
      lineHeight: '26px'
    }
  },
  colors: {
    black: '#1A1919',
    lightGrey: '#F5F5F5',
    grey: '#DCDCDC',
    darkGrey: '#7F7F7F',
    white: '#FFFFFF',
    purple: '#7247C4'
  },
  border: {
    wavyRadius: '30px 2px 30% 3px / 4px 10px 3px 30px'
  },
  space: [0, 4, 8, 16, 32, 64, 128, 256, 512],
  spacings: memoize(calculateSpacing)
};

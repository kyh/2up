import { DefaultTheme, css } from "styled-components";
import { memoize } from "lodash";

const SPACING_UNIT = 4;
const calculateSpacing = (n: number): string => {
  return `${n * SPACING_UNIT}px`;
};

const colors = {
  purple: "#7247C4",
  white: "#FFFFFF",
  black: "#1A202C",
  backgroundGrey: "#EDF2F7",
  lightGrey: "#CBD5E0",
  grey: "#718096",
  darkGrey: "#2D3748",
  red: "#f05252",
};

const mediaSizes = {
  desktop: 900,
};

export const lightTheme: DefaultTheme = {
  colors,
  typography: {
    h1: {
      fontSize: "40px",
      lineHeight: "48px",
    },
    h2: {
      fontSize: "32px",
      lineHeight: "36px",
    },
    h3: {
      fontSize: "18px",
      lineHeight: "26px",
    },
  },
  space: [0, 4, 8, 16, 32, 64, 128, 256, 512],
  spacings: memoize(calculateSpacing),
  media: {
    desktop: (mandatory: any, ...args) => css`
      @media (min-width: ${mediaSizes.desktop}px) {
        ${css(mandatory, ...args)};
      }
    `,
  },
  border: {
    color: colors.darkGrey,
    alternateColor: colors.grey,
    wavyRadius: "30px 2px 30% 3px / 4px 10px 3px 30px",
  },
  ui: {
    text: colors.black,
    lightText: colors.grey,
    background: colors.white,
    backgroundGrey: colors.backgroundGrey,
    backgroundInverse: colors.darkGrey,
    card: {
      border: colors.black,
    },
    button: {
      color: colors.black,
      background: colors.white,
      border: colors.black,
    },
    modal: {
      border: colors.black,
      background: colors.white,
    },
    alert: {
      text: colors.white,
      background: colors.black,
    },
  },
};

export const darkTheme: DefaultTheme = {
  ...lightTheme,
  border: {
    color: colors.lightGrey,
    alternateColor: colors.grey,
    wavyRadius: "30px 2px 30% 3px / 4px 10px 3px 30px",
  },
  ui: {
    text: colors.white,
    lightText: colors.lightGrey,
    background: colors.black,
    backgroundGrey: colors.darkGrey,
    backgroundInverse: colors.backgroundGrey,
    card: {
      border: colors.lightGrey,
    },
    button: {
      color: colors.white,
      background: colors.black,
      border: colors.lightGrey,
    },
    modal: {
      border: colors.lightGrey,
      background: colors.black,
    },
    alert: {
      text: colors.black,
      background: colors.white,
    },
  },
};

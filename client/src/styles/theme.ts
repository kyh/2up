import { DefaultTheme } from "styled-components";
import { memoize } from "lodash";

const SPACING_UNIT = 4;
const calculateSpacing = (n: number): string => {
  return `${n * SPACING_UNIT}px`;
};

const colors = {
  black: "#1A1919",
  lightGrey: "#F5F5F5",
  grey: "#DCDCDC",
  darkGrey: "#7F7F7F",
  white: "#FFFFFF",
  purple: "#7247C4",
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
  border: {
    wavyRadius: "30px 2px 30% 3px / 4px 10px 3px 30px",
  },
  space: [0, 4, 8, 16, 32, 64, 128, 256, 512],
  spacings: memoize(calculateSpacing),
  ui: {
    text: colors.black,
    background: colors.white,
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
  ui: {
    text: colors.white,
    background: colors.black,
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

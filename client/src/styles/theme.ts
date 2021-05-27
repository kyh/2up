import { css } from "styled-components";
import { memoize } from "lodash";

export const colors = {
  purple: "#7247C4",
  white: "#FFFFFF",
  black: "#1A202C",
  greyBackground: "#EDF2F7",
  greyLight: "#CBD5E0",
  grey: "#718096",
  greyDark: "#2D3748",
  red: "#f05252",
  yellow: "#ffca64",
};

export const breakpoints = {
  desktop: "@media (min-width: 900px)",
};

const SPACING_UNIT = 4;
export const spacings = memoize((n: number): string => {
  return `${n * SPACING_UNIT}px`;
});

export const ui = {
  text: "var(--text)",
  textGrey: "var(--text-grey)",
  background: "var(--background)",
  backgroundGrey: "var(--background-grey)",
  backgroundInverse: "var(--background-inverse)",
  cardBorder: "var(--card-border)",
  buttonText: "var(--button-text)",
  buttonBackground: "var(--button-background)",
  buttonBorder: "var(--button-border)",
  modalBorder: "var(--modal-border)",
  modalBackground: "var(--modal-background)",
  alertText: "var(--alert-text)",
  alertBackground: "var(--alert-background)",
  borderColor: "var(--border-color)",
  borderColorAlternate: "var(--border-color-alternate)",
  borderWavyRadius: "var(--border-wavy-radius)",
};

export const lightStyles = css`
  :root {
    --text: ${colors.black};
    --text-grey: ${colors.grey};
    --background: ${colors.white};
    --background-grey: ${colors.greyBackground};
    --background-inverse: ${colors.greyDark};

    --card-border: ${colors.black};

    --button-text: ${colors.black};
    --button-background: ${colors.white};
    --button-border: ${colors.black};

    --modal-border: ${colors.black};
    --modal-background: ${colors.white};

    --alert-text: ${colors.white};
    --alert-background: ${colors.black};

    --border-color: ${colors.greyDark};
    --border-color-alternate: ${colors.grey};
    --border-wavy-radius: 30px 2px 30% 3px / 4px 10px 3px 30px;
  }
`;

export const darkStyles = css`
  :root {
    --text: ${colors.white};
    --text-grey: ${colors.greyLight};
    --background: ${colors.black};
    --background-grey: ${colors.greyDark};
    --background-inverse: ${colors.greyBackground};

    --card-border: ${colors.greyLight};

    --button-text: ${colors.white};
    --button-background: ${colors.black};
    --button-border: ${colors.greyLight};

    --modal-border: ${colors.greyLight};
    --modal-background: ${colors.black};

    --alert-text: ${colors.black};
    --alert-background: ${colors.white};

    --border-color: ${colors.greyLight};
    --border-color-alternate: ${colors.grey};
    --border-wavy-radius: 30px 2px 30% 3px / 4px 10px 3px 30px;
  }
`;

export const theme = {
  colors,
  breakpoints,
  spacings,
  ui,
};

export const getComputedBorder = memoize((isDarkMode: boolean) => {
  const color = isDarkMode ? colors.greyLight : colors.greyDark;
  return color.replace("#", "");
});

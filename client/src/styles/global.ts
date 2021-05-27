import styledNormalize from "styled-normalize";
import { createGlobalStyle } from "styled-components";
import { theme, lightStyles, darkStyles } from "styles/theme";

export const GlobalStyle = createGlobalStyle`
  ${styledNormalize}

  ${({ theme }: any) => (theme.isDarkMode ? darkStyles : lightStyles)}

  html {
    box-sizing: border-box;
  }

  *,
  *:before,
  *:after {
    box-sizing: inherit;
  }

  body {
    color: ${theme.ui.text};
    background-color: ${theme.ui.background};
    text-rendering: optimizeLegibility;
    font-family: 'Chalkboard SE', -apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif,
      'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol';
  }

  a {
    color: inherit;
    text-decoration: inherit;
  }

  /* Remove button styling */
  button,
  input[type='submit'],
  input[type='reset'] {
    background: none;
    color: inherit;
    border: none;
    padding: 0;
    font: inherit;
    cursor: pointer;
    outline: inherit;
  }

  h1, h2, h3, h4, h5, h6, p {
    margin: 0 0 ${theme.spacings(3)};
  }

  p {
    line-height: 1.6;
  }

  fieldset {
    border: none;
    padding: 0;
    margin: 0 0 ${theme.spacings(3)};
  }

  label {
    display: block;
    margin: 0 0 ${theme.spacings(1)};
  }
`;

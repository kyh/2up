import { ReactNode } from "react";
import styledNormalize from "styled-normalize";
import { createGlobalStyle } from "styled-components";
import { theme, lightStyles, darkStyles } from "~/styles/theme";
import { useHomeStore } from "~/lib/home/homeStore";

const GlobalStyle = createGlobalStyle<{ isDarkMode: boolean }>`
  ${styledNormalize}

  @font-face {
    font-family: "Chalkboard SE";
    src: url("/fonts/ChalkboardSE-Regular.woff2") format("woff2"),
      url("/fonts/ChalkboardSE-Regular.woff") format("woff");
    font-weight: normal;
    font-style: normal;
    font-display: fallback;
  }

  html {
    box-sizing: border-box;
  }

  *,
  *::before,
  *::after {
    box-sizing: inherit;
  }

  body {
    color: ${theme.ui.text};
    background-color: ${theme.ui.background};
    text-rendering: optimizeLegibility;
    font-family: "Chalkboard SE", -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif,
      "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol";
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

    &:disabled {
      filter: brightness(0.5);
      cursor: not-allowed;
    }
  }

  h1 {
    font-size: 2rem;
  }

  h2 {
    font-size: 1.5rem;
  }

  h3 {
    font-size: 1.2rem;
  }

  h4 {
    font-size: 1rem;
  }

  h5 {
    font-size: 0.8rem;
  }

  h6 {
    font-size: 0.6rem;
  }

  h1, h2, h3, h4, h5, h6, p, ul {
    margin: 0 0 ${theme.spacings(3)};
  }

  p {
    line-height: 1.6;
  }

  li {
    margin-bottom: ${theme.spacings(2)};
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

  a:focus,
  button:focus,
  input:focus {
    outline: 2px dashed ${theme.ui.borderColor};
    outline-offset: 2px;
  }

  .ease-out {
    transition-timing-function: cubic-bezier(0, 0, 0.2, 1);
  }

  .ease-in	{
    transition-timing-function: cubic-bezier(0.4, 0, 1, 1);
  }

  .ease-in-out {
    transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  }

  .duration-100 { transition-duration: 100ms; }

  .opacity-0 { opacity: 0; }
  .opacity-100 { opacity: 1; }

  .scale-95 { transform: scale(0.95); }
  .scale-100 { transform: scale(1); }

  ${({ isDarkMode }) => (isDarkMode ? darkStyles : lightStyles)}
`;

export const StyleProvider = ({ children }: { children: ReactNode }) => {
  const isDarkMode = useHomeStore((state) => state.isDarkMode);
  return (
    <>
      <GlobalStyle isDarkMode={isDarkMode} />
      {children}
    </>
  );
};

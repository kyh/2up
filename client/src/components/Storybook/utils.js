import styled, { ThemeProvider } from "styled-components";
import { theme } from "styles/theme";
import { GlobalStyle } from "styles/global";

export const withTheme = (story) => (
  <ThemeProvider theme={theme}>
    <GlobalStyle />
    <main>{story()}</main>
  </ThemeProvider>
);

const Container = styled.section`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  max-width: 1200px;
  margin: auto;
  padding: 12px;
`;

export const withContainer = (story) => <Container>{story()}</Container>;

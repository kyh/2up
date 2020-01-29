import React from 'react';
import { ThemeProvider } from 'styled-components';
import { theme } from 'styles/theme';
import { GlobalStyle } from 'styles/global';
import { Box } from 'components';

export const withTheme = story => (
  <ThemeProvider theme={theme}>
    <GlobalStyle />
    <main>{story()}</main>
  </ThemeProvider>
);

export const withContainer = story => (
  <Box
    display="flex"
    flexDirection="column"
    justifyContent="center"
    alignItems="center"
    maxWidth={1200}
    m="auto"
    p={3}
  >
    {story()}
  </Box>
);

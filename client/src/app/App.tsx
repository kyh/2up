import React from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';

import { PageContainer, Navigation } from 'components';

import { lightTheme, darkTheme } from 'styles/theme';
import { GlobalStyle } from 'styles/global';

import { usePlayhouse } from 'features/home/playhouseSlice';
import { Home } from 'features/home/Home';
import { GameMaster } from 'features/gamemaster/GameMaster';
import { TriviaRoutes } from 'features/trivia/TriviaRoutes';

export const App: React.FC = () => {
  const { state } = usePlayhouse();
  return (
    <ThemeProvider theme={state.isDarkMode ? darkTheme : lightTheme}>
      <GlobalStyle />
      <Navigation />
      <Switch>
        <Route exact path="/">
          <PageContainer size="large" align="center">
            <Home />
          </PageContainer>
        </Route>
        <Route path="/trivia/:gameID">
          <TriviaRoutes />
        </Route>
        <Route exact path="/gamemaster">
          <PageContainer size="large" align="center">
            <GameMaster />
          </PageContainer>
        </Route>
        <Redirect to="/" />
      </Switch>
    </ThemeProvider>
  );
};

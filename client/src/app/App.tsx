import React from 'react';
import { Switch, Route } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';

import { PageContainer, Navigation } from 'components';

import { usePlayhouse } from 'features/home/PlayhouseChannel';
import { lightTheme, darkTheme } from 'styles/theme';
import { GlobalStyle } from 'styles/global';

import { Home } from 'features/home/Home';
import { Dashboard } from 'features/dashboard/Dashboard';
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
        <Route exact path="/dashboard">
          <PageContainer size="large" align="center">
            <Dashboard />
          </PageContainer>
        </Route>
        <Route path="/trivia/:gameID">
          <TriviaRoutes />
        </Route>
      </Switch>
    </ThemeProvider>
  );
};

import React from "react";
import { Switch, Route, Redirect } from "react-router-dom";
import { ThemeProvider } from "styled-components";
import { Provider as AlertProvider, transitions, positions } from "react-alert";

import { PageContainer, Navigation, ReactAlertTemplate } from "components";

import { lightTheme, darkTheme } from "styles/theme";
import { GlobalStyle } from "styles/global";

import { usePlayhouse } from 'features/home/playhouseSlice';
import { Home } from 'features/home/Home';
import { GameMasterRoutes } from 'features/gamemaster/GameMasterRoutes';
import { GameRoutes } from 'features/game/GameRoutes';
import { Enter } from 'features/user/Enter';

const alertOptions = {
  position: positions.TOP_CENTER,
  transition: transitions.SCALE,
  timeout: 8000,
};

export const App: React.FC = () => {
  const { state } = usePlayhouse();
  return (
    <ThemeProvider theme={state.isDarkMode ? darkTheme : lightTheme}>
      <AlertProvider template={ReactAlertTemplate} {...alertOptions}>
        <GlobalStyle />
        <Navigation />
        <Switch>
          <Route exact path="/">
            <PageContainer size="large" align="center">
              <Home />
            </PageContainer>
          </Route>
          <Route path="/game/:gameId">
            <GameRoutes />
          </Route>
          <Route path="/enter">
            <PageContainer size="large">
              <Enter />
            </PageContainer>
          </Route>
          <GameMasterRoutes />
          <Redirect to="/" />
        </Switch>
      </AlertProvider>
    </ThemeProvider>
  );
};

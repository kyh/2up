import React from "react";
import { Switch, Route, Redirect } from "react-router-dom";
import { ThemeProvider } from "styled-components";
import { Provider as AlertProvider, transitions, positions } from "react-alert";

import { Navigation, ReactAlertTemplate } from "components";

import { lightTheme, darkTheme } from "styles/theme";
import { GlobalStyle } from "styles/global";

import { usePlayhouse } from "features/home/playhouseSlice";
import { Home } from "features/home/Home";
import { GameMasterRoutes } from "features/gamemaster/GameMasterRoutes";
import { GameRoutes } from "features/game/GameRoutes";
import { Signup } from "features/auth/Signup";
import { Login } from "features/auth/Login";

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
            <Home />
          </Route>
          <Route path="/game/:gameId">
            <GameRoutes />
          </Route>
          <Route path="/signup">
            <Signup />
          </Route>
          <Route path="/login">
            <Login />
          </Route>
          <Route path="/gamemaster">
            <GameMasterRoutes />
          </Route>
          <Redirect to="/" />
        </Switch>
      </AlertProvider>
    </ThemeProvider>
  );
};

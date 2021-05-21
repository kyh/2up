import { Switch, Route, Redirect } from "react-router-dom";
import { ThemeProvider } from "styled-components";
import { Provider as AlertProvider, transitions, positions } from "react-alert";

import { ReactAlertTemplate } from "components";
import { lightTheme, darkTheme } from "styles/theme";
import { GlobalStyle } from "styles/global";
import { useAppSelector } from "app/hooks";

import { HomeRoutes } from "features/home/HomeRoutes";
import { PackRoutes } from "features/packs/PackRoutes";
import { GameRoutes } from "features/game/GameRoutes";
import { AuthRoutes } from "features/auth/AuthRoutes";
import { ProfilePage } from "features/profile/ProfilePage";

const alertOptions = {
  position: positions.TOP_CENTER,
  transition: transitions.SCALE,
  timeout: 8000,
};

export const App = () => {
  const isDarkMode = useAppSelector((state) => state.playhouse.isDarkMode);
  return (
    <ThemeProvider theme={isDarkMode ? darkTheme : lightTheme}>
      <AlertProvider template={ReactAlertTemplate} {...alertOptions}>
        <GlobalStyle />
        <Switch>
          <Route exact path={["/", "/join"]}>
            <HomeRoutes />
          </Route>
          <Route path="/game/:gameId">
            <GameRoutes />
          </Route>
          <Route path="/auth">
            <AuthRoutes />
          </Route>
          <Route path="/packs">
            <PackRoutes />
          </Route>
          <Route path="/:username">
            <ProfilePage />
          </Route>
          <Redirect to="/" />
        </Switch>
      </AlertProvider>
    </ThemeProvider>
  );
};

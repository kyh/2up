import React from "react";
import { Route, Switch } from "react-router-dom";

import { AuthPage } from "features/auth/AuthPage";

export const AuthRoutes: React.FC = () => {
  return (
    <Switch>
      <Route path="/auth/signup">
        <AuthPage />
      </Route>
      <Route path="/auth/login">
        <AuthPage isLogin />
      </Route>
    </Switch>
  );
};

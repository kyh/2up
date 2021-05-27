import { Route, Switch } from "react-router-dom";
import { AuthPage } from "features/auth/AuthPage";

export const AuthRoutes = () => {
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

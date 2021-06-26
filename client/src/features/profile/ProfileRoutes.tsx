import { Route, Switch } from "react-router-dom";
import { ProfilePage } from "features/profile/ProfilePage";

export const ProfileRoutes = () => {
  return (
    <Switch>
      <Route exact path="/@:username">
        <ProfilePage />
      </Route>
    </Switch>
  );
};

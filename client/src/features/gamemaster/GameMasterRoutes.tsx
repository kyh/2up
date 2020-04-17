import React from "react";
import { Route } from "react-router-dom";

import { DiscoverPage } from "features/gamemaster/DiscoverPage";
import { PackEditPage } from "features/gamemaster/PackEditPage";

export const GameMasterRoutes: React.FC = () => {
  return (
    <>
      <Route exact path="/gamemaster">
        <DiscoverPage />
      </Route>
      <Route exact path="/gamemaster/:packId">
        <PackEditPage />
      </Route>
    </>
  );
};

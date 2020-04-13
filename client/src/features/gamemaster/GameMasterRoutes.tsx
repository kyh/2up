import React from "react";
import { Route } from "react-router-dom";

import { PacksPage } from "features/gamemaster/PacksPage";
import { ActPage } from "features/gamemaster/ActPage";

export const GameMasterRoutes: React.FC = () => {
  return (
    <>
      <Route exact path="/gamemaster">
        <PacksPage />
      </Route>
      <Route exact path="/gamemaster/:packId">
        <ActPage />
      </Route>
    </>
  );
};

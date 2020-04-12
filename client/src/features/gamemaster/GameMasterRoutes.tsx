import React from "react";
import { Route } from "react-router-dom";

import { ActPage } from "./ActPage";

export const GameMasterRoutes = () => {
  return (
    <>
      <Route exact path="/gamemaster">
        <ActPage />
      </Route>
    </>
  );
};

import React, { Suspense } from "react";
import { Route } from "react-router-dom";

import { PackDiscoverPage } from "features/gamemaster/PackDiscoverPage";
import { PackDetailsPage } from "features/gamemaster/PackDetailsPage";
import { PackCreatorPage } from "features/gamemaster/PackCreatorPage";

export const GameMasterRoutes: React.FC = () => {
  return (
    <>
      <Route exact path="/gamemaster">
        <PackDiscoverPage />
      </Route>
      <Route exact path="/gamemaster/:packId">
        <Suspense fallback="Loading...">
          <PackDetailsPage />
        </Suspense>
      </Route>
      <Route exact path="/gamemaster/:packId/edit">
        <Suspense fallback="Loading...">
          <PackCreatorPage />
        </Suspense>
      </Route>
    </>
  );
};

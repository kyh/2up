import React, { Suspense } from "react";
import { Route } from "react-router-dom";

import { PackDiscoverPage } from "features/gamemaster/PackDiscoverPage";
import { PackDetailsPage } from "features/gamemaster/PackDetailsPage";
import { PackCreatorPageContainer } from "features/gamemaster/PackCreatorPage";

export const GameMasterRoutes: React.FC = () => {
  return (
    <>
      <Route exact path="/gamemaster">
        <PackDiscoverPage />
      </Route>
      <Route exact path="/gamemaster/:packId">
        <PackDetailsPage />
      </Route>
      <Route exact path="/gamemaster/:packId/edit">
        <Suspense fallback="Loading...">
          <PackCreatorPageContainer />
        </Suspense>
      </Route>
    </>
  );
};

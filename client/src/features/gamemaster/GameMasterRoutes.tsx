import React from "react";
import { Route } from "react-router-dom";
import { PageContainer } from "components";

import { GameMaster } from "features/gamemaster/GameMaster";

export const GameMasterRoutes = () => {
  return (
    <>
      <Route exact path="/gamemaster">
        <PageContainer size="large" align="center">
          <GameMaster />
        </PageContainer>
      </Route>
    </>
  );
};

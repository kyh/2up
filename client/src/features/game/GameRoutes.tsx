import React from "react";
import { Route, Switch, useParams } from "react-router-dom";

import { GameProvider } from "features/game/GameChannel";
import { GameLobby } from "features/game/GameLobby";
import { GameTV } from "features/game/GameTV";
import { GameRemote } from "features/game/GameRemote";

import { Navigation } from "features/game/components/Navigation";
import { PageContainer } from "components";

export const GameRoutes: React.FC = () => {
  const { gameId } = useParams();
  return (
    <Switch>
      <GameProvider gameId={gameId}>
        <Navigation />
        <Route exact path={`/game/${gameId}/lobby`}>
          <PageContainer size="full">
            <GameLobby />
          </PageContainer>
        </Route>
        <Route exact path={`/game/${gameId}/tv`}>
          <PageContainer size="large" align="center">
            <GameTV />
          </PageContainer>
        </Route>
        <Route exact path={`/game/${gameId}/remote`}>
          <PageContainer size="small">
            <GameRemote />
          </PageContainer>
        </Route>
      </GameProvider>
    </Switch>
  );
};

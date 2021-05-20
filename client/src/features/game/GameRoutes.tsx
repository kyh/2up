import { Route, Switch, useParams } from "react-router-dom";

import { GameProvider } from "features/game/GameProvider";
import { GameLobby } from "features/game/GameLobby";
import { GameSpectate } from "features/game/GameSpectate";
import { Game } from "features/game/Game";

import { Navigation } from "features/game/components/Navigation";
import { PageContainer } from "components";

export const GameRoutes = () => {
  const { gameId } = useParams<{ gameId: string }>();
  return (
    <Switch>
      <GameProvider gameId={gameId}>
        <Navigation />
        <Route exact path={`/game/${gameId}/lobby`}>
          <PageContainer size="full">
            <GameLobby />
          </PageContainer>
        </Route>
        <Route exact path={`/game/${gameId}`}>
          <PageContainer size="small">
            <Game />
          </PageContainer>
        </Route>
        <Route exact path={`/game/${gameId}/spectate`}>
          <PageContainer size="large" align="center">
            <GameSpectate />
          </PageContainer>
        </Route>
      </GameProvider>
    </Switch>
  );
};

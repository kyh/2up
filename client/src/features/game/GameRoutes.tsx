import { Route, Switch, useParams } from "react-router-dom";

import { GameProvider } from "features/game/GameProvider";
import { GameLobby } from "features/game/GameLobby";
import { Game } from "features/game/Game";

import { Navigation } from "features/game/components/Navigation";
import { PageContainer } from "components";

export const GameRoutes = () => {
  const { gameId } = useParams<{ gameId: string }>();
  return (
    <Switch>
      <GameProvider gameId={gameId}>
        <Navigation />
        <Route exact path="/game/:gameId/lobby">
          <PageContainer justify="start">
            <GameLobby />
          </PageContainer>
        </Route>
        <Route exact path="/game/:gameId">
          <PageContainer justify="start">
            <Game />
          </PageContainer>
        </Route>
        <Route exact path="/game/:gameId/lobby/spectate">
          <PageContainer justify="start">
            <GameLobby isSpectate />
          </PageContainer>
        </Route>
        <Route exact path="/game/:gameId/spectate">
          <PageContainer justify="start">
            <Game isSpectate />
          </PageContainer>
        </Route>
      </GameProvider>
    </Switch>
  );
};

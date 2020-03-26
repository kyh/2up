import React from 'react';
import { Route, useParams } from 'react-router-dom';
import { PageContainer } from 'components';

import { GameProvider } from 'features/game/GameChannel';
import { GameLobby } from 'features/game/GameLobby';
import { GameTV } from 'features/game/GameTV';
import { GameRemote } from 'features/game/GameRemote';

export const GameRoutes: React.FC = () => {
  const { gameId } = useParams();
  return (
    <GameProvider gameId={gameId}>
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
  );
};

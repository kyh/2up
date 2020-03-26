import React from 'react';
import { Route, useParams } from 'react-router-dom';
import { PageContainer } from 'components';

import { TriviaProvider } from 'features/trivia/TriviaChannel';
import { TriviaLobby } from 'features/trivia/TriviaLobby';
import { TriviaTV } from 'features/trivia/TriviaTV';
import { TriviaRemote } from 'features/trivia/TriviaRemote';

export const TriviaRoutes: React.FC = () => {
  const { gameId } = useParams();
  return (
    <TriviaProvider gameId={gameId}>
      <Route exact path={`/trivia/${gameId}/lobby`}>
        <PageContainer size="full">
          <TriviaLobby />
        </PageContainer>
      </Route>
      <Route exact path={`/trivia/${gameId}/tv`}>
        <PageContainer size="large" align="center">
          <TriviaTV />
        </PageContainer>
      </Route>
      <Route exact path={`/trivia/${gameId}/remote`}>
        <PageContainer size="small">
          <TriviaRemote />
        </PageContainer>
      </Route>
    </TriviaProvider>
  );
};

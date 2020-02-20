import React from 'react';
import { Route, useParams } from 'react-router-dom';
import { PageContainer } from 'components';

import { TriviaProvider } from 'features/trivia/TriviaChannel';
import { TriviaLobby } from 'features/trivia/TriviaLobby';
import { TriviaTV } from 'features/trivia/TriviaTV';
import { TriviaRemote } from 'features/trivia/TriviaRemote';

export const TriviaRoutes: React.FC = () => {
  const { gameID } = useParams();
  return (
    <TriviaProvider gameID={gameID}>
      <Route exact path={`/trivia/${gameID}/lobby`}>
        <PageContainer size="full">
          <TriviaLobby />
        </PageContainer>
      </Route>
      <Route exact path={`/trivia/${gameID}/tv`}>
        <PageContainer size="large" align="center">
          <TriviaTV />
        </PageContainer>
      </Route>
      <Route exact path={`/trivia/${gameID}/remote`}>
        <PageContainer size="small">
          <TriviaRemote />
        </PageContainer>
      </Route>
    </TriviaProvider>
  );
};

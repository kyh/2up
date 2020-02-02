import React from 'react';
import { Switch, Route } from 'react-router-dom';
import { PageContainer } from 'components';

import { TriviaProvider } from 'games/trivia/TriviaContext';
import { TriviaLobby } from 'games/trivia/TriviaLobby';
import { TriviaTV } from 'games/trivia/TriviaTV';
import { TriviaRemote } from 'games/trivia/TriviaRemote';

export const App: React.FC = () => {
  return (
    <TriviaProvider>
      <Switch>
        <Route exact path="/">
          <PageContainer>
            <TriviaLobby />
          </PageContainer>
        </Route>
        <Route path="/trivia/tv">
          <PageContainer variant="tv">
            <TriviaTV />
          </PageContainer>
        </Route>
        <Route path="/trivia/remote">
          <PageContainer variant="remote">
            <TriviaRemote />
          </PageContainer>
        </Route>
      </Switch>
    </TriviaProvider>
  );
};

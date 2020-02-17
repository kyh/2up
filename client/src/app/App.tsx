import React from 'react';
import { Switch, Route } from 'react-router-dom';
import { PageContainer, Navigation } from 'components';

import { Home } from 'features/home/Home';

import { TriviaProvider } from 'features/trivia/TriviaContext';
import { TriviaLobby } from 'features/trivia/TriviaLobby';
import { TriviaTV } from 'features/trivia/TriviaTV';
import { TriviaRemote } from 'features/trivia/TriviaRemote';

export const App: React.FC = () => {
  return (
    <>
      <Navigation />
      <Switch>
        <Route exact path="/">
          <PageContainer size="large" align="center">
            <Home />
          </PageContainer>
        </Route>
        <Route path="/trivia">
          <TriviaProvider>
            <Route exact path="/trivia/lobby">
              <PageContainer size="full">
                <TriviaLobby />
              </PageContainer>
            </Route>
            <Route exact path="/trivia/tv">
              <PageContainer size="large" align="center">
                <TriviaTV />
              </PageContainer>
            </Route>
            <Route exact path="/trivia/remote">
              <PageContainer size="small">
                <TriviaRemote />
              </PageContainer>
            </Route>
          </TriviaProvider>
        </Route>
      </Switch>
    </>
  );
};

import React from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import { PageContainer, Navigation } from 'components';

import { PlayhouseProvider } from 'context/PlayhouseChannel';
import { Home } from 'features/home/Home';
import { TriviaRoutes } from 'features/trivia/TriviaRoutes';

export const App: React.FC = () => {
  return (
    <BrowserRouter>
      <PlayhouseProvider>
        <Navigation />
        <Switch>
          <Route exact path="/">
            <PageContainer size="large" align="center">
              <Home />
            </PageContainer>
          </Route>
          <Route path="/trivia/:gameID">
            <TriviaRoutes />
          </Route>
        </Switch>
      </PlayhouseProvider>
    </BrowserRouter>
  );
};

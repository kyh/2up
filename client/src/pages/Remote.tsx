import React from 'react';
import { Switch, Route } from 'react-router-dom';
import { PageContainer } from 'components';
import { TriviaRemote } from 'games/trivia/TriviaRemote';

export const Remote = () => {
  return (
    <PageContainer variant="remote">
      <Switch>
        <Route path="/remote/trivia">
          <TriviaRemote />
        </Route>
      </Switch>
    </PageContainer>
  );
};

import React from 'react';
import { Switch, Route } from 'react-router-dom';
import { PageContainer } from 'components';
import { TriviaTV } from 'games/trivia/TriviaTV';

export const TV = () => {
  return (
    <PageContainer variant="tv">
      <Switch>
        <Route path="/tv/trivia">
          <TriviaTV />
        </Route>
      </Switch>
    </PageContainer>
  );
};

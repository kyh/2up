import React from 'react';
import { Switch, Route } from 'react-router-dom';
import { TriviaTV } from 'games/trivia/TriviaTV';

export const TV = () => {
  return (
    <Switch>
      <Route path="/tv/trivia">
        <TriviaTV />
      </Route>
    </Switch>
  );
};

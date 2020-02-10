import React from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';

import { TriviaPages } from './Trivia';

export const App: React.FC = () => {
  return (
    <Switch>
      <Route exact path="/">
        <Redirect to="/trivia" />
      </Route>
      <TriviaPages />
    </Switch>
  );
};

import React from 'react';
import { Switch, Route } from 'react-router-dom';
import { TV } from 'pages/TV';
import { Remote } from 'pages/Remote';

export const App: React.FC = () => {
  return (
    <Switch>
      <Route path="/tv">
        <TV />
      </Route>
      <Route path="/remote">
        <Remote />
      </Route>
    </Switch>
  );
};

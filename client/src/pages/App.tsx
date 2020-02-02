import React from 'react';
import { Switch, Route } from 'react-router-dom';
import { Intro } from 'pages/Intro';
import { TV } from 'pages/TV';
import { Remote } from 'pages/Remote';

export const App: React.FC = () => {
  return (
    <Switch>
      <Route exact path="/">
        <Intro />
      </Route>
      <Route path="/tv">
        <TV />
      </Route>
      <Route path="/remote">
        <Remote />
      </Route>
    </Switch>
  );
};

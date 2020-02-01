import React from 'react';
import { Switch, Route } from 'react-router-dom';
import { MessageRemote } from 'games/messaging/MessageRemote';
import { TriviaRemote } from 'games/trivia/TriviaRemote';

export const Remote = () => {
  return (
    <Switch>
      <Route path="/remote/messaging">
        <MessageRemote />
      </Route>
      <Route path="/remote/trivia">
        <TriviaRemote />
      </Route>
    </Switch>
  );
};

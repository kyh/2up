import React from 'react';
import { Switch, Route } from 'react-router-dom';
import { MessageContainer } from 'acts/messaging/MessageContainer';
import { RemotePromptScene } from 'acts/trivia/remote/1-PromptScene';
import { RemoteAnswerScene } from 'acts/trivia/remote/2-AnswerScene';
import { RemoteScoringScene } from 'acts/trivia/remote/3-ScoringScene';

export const Remote = () => {
  return (
    <Switch>
      <Route path="/messaging">
        <MessageContainer />
      </Route>
      <Route path="/trivia/prompt-scene">
        <RemotePromptScene />
      </Route>
      <Route path="/trivia/answer-scene">
        <RemoteAnswerScene />
      </Route>
      <Route path="/trivia/scoring-scene">
        <RemoteScoringScene />
      </Route>
    </Switch>
  );
};

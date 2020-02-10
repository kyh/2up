import React from 'react';
import { Route } from 'react-router-dom';
import { PageContainer } from 'components';

import { TriviaProvider } from 'games/trivia/TriviaContext';
import { TriviaIntro } from 'games/trivia/TriviaIntro';
import { TriviaLobby } from 'games/trivia/TriviaLobby';
import { TriviaTV } from 'games/trivia/TriviaTV';
import { TriviaRemote } from 'games/trivia/TriviaRemote';

export const TriviaPages: React.FC = () => {
  return (
    <TriviaProvider>
      <Route exact path="/trivia">
        <PageContainer variant="tv">
          <TriviaIntro />
        </PageContainer>
      </Route>
      <Route exact path="/trivia/lobby">
        <PageContainer variant="tv">
          <TriviaLobby />
        </PageContainer>
      </Route>
      <Route exact path="/trivia/tv">
        <PageContainer variant="tv">
          <TriviaTV />
        </PageContainer>
      </Route>
      <Route exact path="/trivia/remote">
        <PageContainer variant="remote">
          <TriviaRemote />
        </PageContainer>
      </Route>
    </TriviaProvider>
  );
};

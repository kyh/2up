import React, { useContext } from 'react';
import { TriviaContext } from 'games/trivia/TriviaContext';
import { Scene1 } from './tv/Scene1';
import { Scene2 } from './tv/Scene2';
import { Scene3 } from './tv/Scene3';

export const TriviaTV: React.FC = () => {
  const { state, broadcast } = useContext(TriviaContext);

  switch (state.scene) {
    case 1:
      return <Scene1 broadcast={broadcast} state={state} />;
    case 2:
      return <Scene2 broadcast={broadcast} state={state} />;
    case 3:
      return <Scene3 broadcast={broadcast} state={state} />;
    default:
      return null;
  }
};

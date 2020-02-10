import React, { useContext } from 'react';
import { TriviaContext } from 'games/trivia/TriviaContext';
import { Scene1 } from './remote/Scene1';
import { Scene2 } from './remote/Scene2';
import { Scene3 } from './remote/Scene3';

export const TriviaRemote: React.FC = () => {
  const { state, broadcast } = useContext(TriviaContext);

  switch (state.scene) {
    case 1:
      return <Scene1 state={state} broadcast={broadcast} />;
    case 2:
      return <Scene2 state={state} broadcast={broadcast} />;
    case 3:
      return <Scene3 state={state} broadcast={broadcast} />;
    default:
      return null;
  }
};

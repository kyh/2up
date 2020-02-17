import React, { useContext } from 'react';
import { TriviaContext } from 'features/trivia/TriviaContext';
import { Scene0 } from './tv/Scene0';
import { Scene1 } from './tv/Scene1';
import { Scene2 } from './tv/Scene2';
import { Scene3 } from './tv/Scene3';
import { Scene4 } from './tv/Scene4';

export const TriviaTV: React.FC = () => {
  const { state, broadcast } = useContext(TriviaContext);

  switch (state.scene) {
    case 0:
      return <Scene0 state={state} broadcast={broadcast} />;
    case 1:
      return <Scene1 broadcast={broadcast} state={state} />;
    case 2:
      return <Scene2 broadcast={broadcast} state={state} />;
    case 3:
      return <Scene3 broadcast={broadcast} state={state} />;
    case 4:
      return <Scene4 broadcast={broadcast} state={state} />;
    default:
      return null;
  }
};

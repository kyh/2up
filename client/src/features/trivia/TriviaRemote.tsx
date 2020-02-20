import React, { useEffect } from 'react';
import { useTriviaChannel } from 'features/trivia/TriviaChannel';
import { Scene0 } from './remote/Scene0';
import { Scene1 } from './remote/Scene1';
import { Scene2 } from './remote/Scene2';
import { Scene3 } from './remote/Scene3';
import { Scene4 } from './remote/Scene4';

export const TriviaRemote: React.FC = () => {
  const { state, broadcast } = useTriviaChannel();

  useEffect(() => {
    window.scroll(0, 0);
  }, [state.scene]);

  switch (state.scene) {
    case 0:
      return <Scene0 state={state} broadcast={broadcast} />;
    case 1:
      return <Scene1 state={state} broadcast={broadcast} />;
    case 2:
      return <Scene2 state={state} broadcast={broadcast} />;
    case 3:
      return <Scene3 state={state} broadcast={broadcast} />;
    case 4:
      return <Scene4 state={state} broadcast={broadcast} />;
    default:
      return null;
  }
};

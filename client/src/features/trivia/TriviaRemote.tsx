import React, { useEffect } from 'react';
import { useTriviaChannel } from 'features/trivia/TriviaChannel';
import { Scene0Remote } from './scenes/Scene0';
import { Scene1Remote } from './scenes/Scene1';
import { Scene2Remote } from './scenes/Scene2';
import { Scene3Remote } from './scenes/Scene3';
import { Scene4Remote } from './scenes/Scene4';

export const TriviaRemote: React.FC = () => {
  const { state, broadcast } = useTriviaChannel();

  useEffect(() => {
    window.scroll(0, 0);
  }, [state.scene]);

  switch (state.scene) {
    case 0:
      return <Scene0Remote state={state} broadcast={broadcast} />;
    case 1:
      return <Scene1Remote state={state} broadcast={broadcast} />;
    case 2:
      return <Scene2Remote state={state} broadcast={broadcast} />;
    case 3:
      return <Scene3Remote state={state} broadcast={broadcast} />;
    case 4:
      return <Scene4Remote state={state} broadcast={broadcast} />;
    default:
      return null;
  }
};

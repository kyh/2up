import React, { useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import {
  useTrivia,
  initialState,
  TriviaGameState
} from 'games/trivia/useTrivia';

export const TriviaContext = React.createContext({
  state: initialState,
  broadcast: (_eventName: string, _payload?: object) => {}
});

export const TriviaProvider = ({ children }: { children: React.ReactNode }) => {
  const history = useHistory();
  const [state, broadcast] = useTrivia();

  useEffect(() => {
    if (!state.connected) {
      history.push('/trivia');
    }
  }, [state.connected, history]);

  return (
    <TriviaContext.Provider value={{ state, broadcast }}>
      {children}
    </TriviaContext.Provider>
  );
};

export interface SceneProps {
  state: TriviaGameState;
  broadcast: (_eventName: string, _payload?: object) => void;
}

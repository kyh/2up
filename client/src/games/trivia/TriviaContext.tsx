import React, { useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import {
  useTrivia,
  initialState,
  TriviaGameState
} from 'games/trivia/useTrivia';
import { useQueryParams } from 'games/trivia/useQueryParams';

export const TriviaContext = React.createContext({
  state: initialState,
  broadcast: (_eventName: string, _payload?: object) => {}
});

export const TriviaProvider: React.FC = ({ children }) => {
  const history = useHistory();
  const queryParams = useQueryParams();
  const code = queryParams.get('code');
  const [state, broadcast] = useTrivia(code || '');

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

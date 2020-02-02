import React from 'react';
import { useTrivia, initialState } from 'games/trivia/useTrivia';

export const TriviaContext = React.createContext({
  state: initialState,
  broadcast: (_eventName: string, _payload: any) => {}
});

export const TriviaProvider = ({ children }: { children: React.ReactNode }) => {
  const [state, broadcast] = useTrivia();
  return (
    <TriviaContext.Provider value={{ state, broadcast }}>
      {children}
    </TriviaContext.Provider>
  );
};

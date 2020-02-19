import React, { useContext } from 'react';
import { useSelector } from 'react-redux';
import { useChannel } from 'context/Socket';
import { RootState } from 'app/rootReducer';
import { initialState } from 'features/trivia/triviaSlice';

export const TriviaContext = React.createContext({
  state: initialState,
  broadcast: (_eventName: string, _payload?: object) => {}
});

export const TriviaProvider: React.FC<{ gameID?: string }> = ({
  children,
  gameID
}) => {
  const [state, broadcast] = useChannel(
    `trivia:${gameID}`,
    state => state.trivia
  );

  return (
    <TriviaContext.Provider value={{ state, broadcast }}>
      {children}
    </TriviaContext.Provider>
  );
};

export const useTriviaChannel = () => {
  return useContext(TriviaContext);
};

export const useTriviaState = () => {
  return useSelector((state: RootState) => state.trivia);
};

import React, { useContext, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useChannel } from 'context/Socket';
import { RootState } from 'app/rootReducer';
import { initialState, triviaActions } from 'features/trivia/triviaSlice';

export const TriviaContext = React.createContext({
  state: initialState,
  broadcast: (_eventName: string, _payload?: object) => {},
  dispatch: (_action: object) => {}
});

export const TriviaProvider: React.FC<{ gameID?: string }> = ({
  children,
  gameID
}) => {
  const [state, broadcast, dispatch, connected] = useChannel(
    `trivia:${gameID}`,
    state => state.trivia,
    {
      name: localStorage.getItem('name'),
      isHost: localStorage.getItem('isHost') === 'true'
    }
  );

  useEffect(() => {
    if (!state.gameID) {
      dispatch(triviaActions.new_game({ gameID: gameID! }));
    }
  }, [state.gameID, gameID]);

  if (!connected) return null;
  return (
    <TriviaContext.Provider value={{ state, broadcast, dispatch }}>
      {children}
    </TriviaContext.Provider>
  );
};

export const useTriviaChannel = () => {
  return useContext(TriviaContext);
};

export const useTrivia = () => {
  const state = useSelector((state: RootState) => state.trivia);
  const dispatch = useDispatch();
  return { state, dispatch };
};

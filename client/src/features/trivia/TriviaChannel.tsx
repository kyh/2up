import React, { useContext, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { useAlert } from 'react-alert';
import { useChannel } from 'utils/Socket';
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
  const history = useHistory();
  const alert = useAlert();
  const [state, broadcast, dispatch, connected, error] = useChannel(
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
    if (error) {
      dispatch(triviaActions.reset());
      alert.show(error);
      history.push('/');
    }
  }, [state.gameID, gameID, error]);

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

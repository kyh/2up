import React, { useContext } from 'react';
import { useSelector } from 'react-redux';
import { useChannel } from 'context/Socket';
import { RootState } from 'app/rootReducer';
import { initialState } from 'app/appSlice';

export const PlayhouseContext = React.createContext({
  state: initialState,
  broadcast: (_eventName: string, _payload?: object) => {},
  dispatch: (_action: object) => {}
});

export const PlayhouseProvider: React.FC = ({ children }) => {
  const [state, broadcast, dispatch] = useChannel(
    'playhouse',
    state => state.app
  );

  return (
    <PlayhouseContext.Provider value={{ state, broadcast, dispatch }}>
      {children}
    </PlayhouseContext.Provider>
  );
};

export const usePlayhouseChannel = () => {
  return useContext(PlayhouseContext);
};

export const useAppState = () => {
  return useSelector((state: RootState) => state.app);
};

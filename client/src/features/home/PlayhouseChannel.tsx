import React, { useContext } from 'react';
import { useChannel } from 'utils/Socket';
import { initialState } from 'features/home/playhouseSlice';

export const PlayhouseContext = React.createContext({
  state: initialState,
  broadcast: (_eventName: string, _payload?: object) => {},
  dispatch: (_action: object) => {}
});

export const PlayhouseProvider: React.FC = ({ children }) => {
  const [state, broadcast, dispatch] = useChannel(
    'playhouse',
    state => state.playhouse
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

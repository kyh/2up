import React, { useContext } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useChannel } from 'utils/Socket';
import { RootState } from 'app/rootReducer';
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

export const usePlayhouse = () => {
  const state = useSelector((state: RootState) => state.playhouse);
  const dispatch = useDispatch();
  return { state, dispatch };
};

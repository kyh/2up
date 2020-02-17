import React, {
  useEffect,
  createContext,
  useContext,
  useReducer,
  useState
} from 'react';
import { Socket } from 'phoenix';

export const SocketContext = createContext({});

type Props = {
  wsUrl: string;
  options: any;
};

export const SocketProvider: React.FC<Props> = ({
  wsUrl = '',
  options = {},
  children
}) => {
  const socket = new Socket(wsUrl, { params: options });

  useEffect(() => {
    socket.connect();
  }, [options, wsUrl]);

  return (
    <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
  );
};

export const useChannel = (
  channelTopic: string,
  reducer: any,
  initialState: any
) => {
  const socket = useContext(SocketContext);
  const [state, dispatch] = useReducer(reducer, initialState);
  const [broadcast, setBroadcast] = useState(mustJoinChannelWarning);

  useEffect(() => joinChannel(socket, channelTopic, dispatch, setBroadcast), [
    channelTopic
  ]);

  return [state, broadcast];
};

const joinChannel = (
  socket: any,
  channelTopic: string,
  dispatch: any,
  setBroadcast: any
) => {
  const channel = socket.channel(channelTopic, { client: 'browser' });

  channel.onMessage = (event: string, payload: any) => {
    dispatch({ event, payload });
    return payload;
  };

  channel
    .join()
    .receive('ok', ({ messages }: any) =>
      console.log('successfully joined channel', messages || '')
    )
    .receive('error', ({ reason }: any) =>
      console.error('failed to join channel', reason)
    );

  setBroadcast(() => channel.push.bind(channel));

  return () => {
    channel.leave();
  };
};

const mustJoinChannelWarning = () => () =>
  console.error(
    `useChannel broadcast function cannot be invoked before the channel has been joined`
  );

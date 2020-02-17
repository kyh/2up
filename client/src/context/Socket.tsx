import React, { useEffect, createContext, useContext, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Socket } from 'phoenix';
import { RootState } from 'app/rootReducer';

export const SocketContext = createContext({} as Socket);

type Props = {
  wsUrl: string;
  options?: any;
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
  selector: (state: RootState) => any,
  initialPayload = {}
) => {
  const socket = useContext(SocketContext);
  const dispatch = useDispatch();
  const state = useSelector(selector);
  const [broadcast, setBroadcast] = useState(mustJoinChannelWarning);

  useEffect(() => {
    const channel = socket.channel(channelTopic, {
      client: 'browser',
      ...initialPayload
    });

    channel.onMessage = (event: string, payload: any) => {
      dispatch({ type: event, payload });
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
  }, [channelTopic]);

  return [state, broadcast];
};

const mustJoinChannelWarning = () => () =>
  console.error(
    `useChannel broadcast function cannot be invoked before the channel has been joined`
  );

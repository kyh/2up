import {
  useEffect,
  createContext,
  useContext,
  useState,
  ReactNode,
} from "react";
import { useSelector, useDispatch } from "react-redux";
import { Socket, Presence } from "phoenix";
import { RootState } from "app/rootReducer";

export const SocketContext = createContext({} as Socket);

type Props = {
  wsUrl: string;
  options?: any;
  children: ReactNode;
};

export const SocketProvider = ({
  wsUrl = "",
  options = {},
  children,
}: Props) => {
  const socket = new Socket(wsUrl, { params: options });

  useEffect(() => {
    socket.connect();
  }, [options, wsUrl]);

  return (
    <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
  );
};

const PRESENCE_EVENTS = {
  state: "presence_state",
  diff: "presence_diff",
};

export const useChannel = (
  channelTopic: string,
  selector: (state: RootState) => any,
  initialPayload = {},
  presenceAction = ""
) => {
  const [connected, setConnected] = useState(false);
  const [error, setError] = useState(null);
  const socket = useContext(SocketContext);
  const dispatch = useDispatch();
  const state = useSelector(selector);
  const [broadcast, setBroadcast] = useState(mustJoinChannelWarning);

  useEffect(() => {
    let presences = {};

    const channel = socket.channel(channelTopic, {
      client: "browser",
      ...initialPayload,
    });

    channel.onMessage = (event: string, payload: any) => {
      if (
        presenceAction &&
        (event === PRESENCE_EVENTS.diff || event === PRESENCE_EVENTS.state)
      ) {
        if (event === PRESENCE_EVENTS.state) {
          presences = payload;
        } else {
          presences = Presence.syncDiff(presences, payload);
        }
        const players = Presence.list(presences)
          .map((p) => p.metas[0])
          .filter((p) => !p.isHost);
        dispatch({ type: presenceAction, payload: { players } });
      } else {
        dispatch({ type: event, payload });
      }
      return payload;
    };

    channel
      .join()
      .receive("ok", ({ messages }: any) => {
        setConnected(true);
        setError(null);
        console.log("successfully joined channel", messages || "");
      })
      .receive("error", ({ reason }: any) => {
        setConnected(false);
        setError(reason);
        console.error("failed to join channel", reason);
      });

    setBroadcast(() => channel.push.bind(channel));

    return () => {
      channel.leave();
    };
  }, [channelTopic]);

  return [state, broadcast, dispatch, connected, error];
};

const mustJoinChannelWarning = () => () =>
  console.error(
    `useChannel broadcast function cannot be invoked before the channel has been joined`
  );

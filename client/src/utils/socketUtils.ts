import { useEffect, useContext, useState } from "react";
import { SocketContext } from "./SocketProvider";

const WHITELIST_EVENTS = ["playhouse", "game"].join("|");

export const socketMiddleware = (_store: any) => (next: any) => (
  action: any
) => {
  const reg = new RegExp(WHITELIST_EVENTS, "gi");
  if (reg.test(action.type)) {
    next(action);
  }
};

export const useChannel = (
  channelTopic: string,
  initialPayload = {},
  onMessage = (_eventName: string, _payload?: any) => {}
) => {
  const socket = useContext(SocketContext);
  const [connected, setConnected] = useState(false);
  const [error, setError] = useState(null);
  const [broadcast, setBroadcast] = useState(errorMessage);

  useEffect(() => {
    const channel = socket.channel(channelTopic, {
      client: "browser",
      ...initialPayload,
    });

    channel.onMessage = (eventName, payload) => {
      onMessage(eventName, payload);
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

  return { broadcast, connected, error };
};

const errorMessage = () => (_eventName: string, _payload?: any) =>
  console.error(
    "useChannel broadcast function cannot be invoked before the channel has been joined"
  );

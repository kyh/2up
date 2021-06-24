import { useEffect, useContext, useState } from "react";
import { Middleware } from "redux";
import { SocketContext } from "./SocketProvider";

const WHITELIST_EVENTS = ["playhouse", "game"].join("|");

export const socketMiddleware: Middleware = (_store) => (next) => (action) => {
  const reg = new RegExp(WHITELIST_EVENTS, "gi");
  if (reg.test(action.type)) {
    next(action);
  }
};

export const useChannel = (
  channelTopic: string,
  initialPayload = {},
  onMessage = (_eventName: string, _payload?: Record<string, any>) => {}
) => {
  const socket = useContext(SocketContext);
  const [connected, setConnected] = useState(false);
  const [error, setError] = useState("");
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
      .receive("ok", ({ messages }: { messages: string }) => {
        setConnected(true);
        setError("");
        console.log("successfully joined channel", messages || "");
      })
      .receive("error", ({ reason }: { reason: string }) => {
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

const errorMessage = () => (
  _eventName: string,
  _payload?: Record<string, any>
) =>
  console.error(
    "useChannel broadcast function cannot be invoked before the channel has been joined"
  );

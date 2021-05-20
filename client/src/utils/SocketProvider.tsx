import { useEffect, createContext, ReactNode } from "react";
import { Socket } from "phoenix";

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

import { useContext, useEffect, createContext, ReactNode } from "react";
import { Socket } from "phoenix";

const SocketContext = createContext({} as Socket);

type Props = {
  wsUrl: string;
  options?: Record<string, string>;
  children: ReactNode;
};

export const SocketProvider = ({
  wsUrl = "",
  options = {},
  children,
}: Props) => {
  const socket =
    typeof window !== "undefined"
      ? new Socket(wsUrl, { params: options })
      : ({} as Socket);

  useEffect(() => {
    socket.connect();
  }, [options, wsUrl]);

  return (
    <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
  );
};

export const useSocket = () => {
  return useContext(SocketContext);
};

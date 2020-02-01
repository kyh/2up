/// <reference types="react-scripts" />

declare module 'use-phoenix-channel' {
  const SocketProvider: any;
  const useChannel: any;
  exports = SocketProvider;
  exports = useChannel;
}

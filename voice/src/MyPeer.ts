import { types } from "mediasoup";

export type MyPeer = {
  sendTransport: types.Transport | null;
  recvTransport: types.Transport | null;
  producer: types.Producer | null;
  consumers: types.Consumer[];
};

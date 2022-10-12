import debugModule from "debug";
import { types } from "mediasoup";
import { VoiceSendDirection } from "src/types";
import { config } from "../config";

const log = debugModule("coinop:create-transport");

export const transportToOptions = ({
  id,
  iceParameters,
  iceCandidates,
  dtlsParameters,
}: types.WebRtcTransport) => ({
  id,
  iceParameters,
  iceCandidates,
  dtlsParameters,
});

export type TransportOptions = ReturnType<typeof transportToOptions>;

export const createTransport = async (
  direction: VoiceSendDirection,
  router: types.Router,
  peerId: string
) => {
  log("create-transport", direction);
  const { listenIps, initialAvailableOutgoingBitrate } =
    config.mediasoup.webRtcTransport;

  const transport = await router.createWebRtcTransport({
    listenIps: listenIps,
    enableUdp: true,
    enableTcp: true,
    preferUdp: true,
    initialAvailableOutgoingBitrate: initialAvailableOutgoingBitrate,
    appData: { peerId, clientDirection: direction },
  });
  return transport;
};

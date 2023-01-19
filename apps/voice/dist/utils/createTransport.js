"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createTransport = exports.transportToOptions = void 0;
const debug_1 = __importDefault(require("debug"));
const config_1 = require("../config");
const log = (0, debug_1.default)("truffles:create-transport");
const transportToOptions = ({ id, iceParameters, iceCandidates, dtlsParameters, }) => ({
    id,
    iceParameters,
    iceCandidates,
    dtlsParameters,
});
exports.transportToOptions = transportToOptions;
const createTransport = (direction, router, peerId) => __awaiter(void 0, void 0, void 0, function* () {
    log("create-transport", direction);
    const { listenIps, initialAvailableOutgoingBitrate } = config_1.config.mediasoup.webRtcTransport;
    const transport = yield router.createWebRtcTransport({
        listenIps: listenIps,
        enableUdp: true,
        enableTcp: true,
        preferUdp: true,
        initialAvailableOutgoingBitrate: initialAvailableOutgoingBitrate,
        appData: { peerId, clientDirection: direction },
    });
    return transport;
});
exports.createTransport = createTransport;
//# sourceMappingURL=createTransport.js.map
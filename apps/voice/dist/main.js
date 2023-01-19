"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
exports.main = void 0;
require("dotenv/config");
const debug_1 = __importDefault(require("debug"));
const Sentry = __importStar(require("@sentry/node"));
const closePeer_1 = require("./utils/closePeer");
const createConsumer_1 = require("./utils/createConsumer");
const createTransport_1 = require("./utils/createTransport");
const deleteRoom_1 = require("./utils/deleteRoom");
const startMediasoup_1 = require("./utils/startMediasoup");
const startRabbit_1 = require("./utils/startRabbit");
const log = (0, debug_1.default)("truffles:index");
const errLog = (0, debug_1.default)("truffles:ERROR");
const rooms = {};
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        if (process.env.SENTRY_DNS) {
            Sentry.init({
                dsn: process.env.SENTRY_DNS,
                enabled: !!process.env.SENTRY_DNS,
            });
        }
        console.log("starting mediasoup");
        let workers;
        try {
            workers = yield (0, startMediasoup_1.startMediasoup)();
        }
        catch (err) {
            console.log(err);
            throw err;
        }
        let workerIdx = 0;
        const getNextWorker = () => {
            const w = workers[workerIdx];
            workerIdx++;
            workerIdx %= workers.length;
            return w;
        };
        const createRoom = () => {
            const { worker, router } = getNextWorker();
            return { worker, router, state: {} };
        };
        yield (0, startRabbit_1.startRabbit)({
            ["remove-speaker"]: ({ roomId, peerId }) => {
                var _a, _b;
                if (roomId in rooms) {
                    const peer = rooms[roomId].state[peerId];
                    (_a = peer === null || peer === void 0 ? void 0 : peer.producer) === null || _a === void 0 ? void 0 : _a.close();
                    (_b = peer === null || peer === void 0 ? void 0 : peer.sendTransport) === null || _b === void 0 ? void 0 : _b.close();
                }
            },
            ["destroy-room"]: ({ roomId }) => {
                if (roomId in rooms) {
                    for (const peer of Object.values(rooms[roomId].state)) {
                        (0, closePeer_1.closePeer)(peer);
                    }
                    (0, deleteRoom_1.deleteRoom)(roomId, rooms);
                }
            },
            ["close-peer"]: ({ roomId, peerId, kicked }, uid, send) => __awaiter(this, void 0, void 0, function* () {
                if (roomId in rooms) {
                    if (peerId in rooms[roomId].state) {
                        (0, closePeer_1.closePeer)(rooms[roomId].state[peerId]);
                        delete rooms[roomId].state[peerId];
                    }
                    if (Object.keys(rooms[roomId].state).length === 0) {
                        (0, deleteRoom_1.deleteRoom)(roomId, rooms);
                    }
                    send({ uid, op: "you_left_room", d: { roomId, kicked: !!kicked } });
                }
            }),
            ["@get-recv-tracks"]: ({ roomId, peerId: myPeerId, rtpCapabilities }, uid, send, errBack) => __awaiter(this, void 0, void 0, function* () {
                var _a, _b;
                if (!((_b = (_a = rooms[roomId]) === null || _a === void 0 ? void 0 : _a.state[myPeerId]) === null || _b === void 0 ? void 0 : _b.recvTransport)) {
                    errBack();
                    return;
                }
                const { state, router } = rooms[roomId];
                const transport = state[myPeerId].recvTransport;
                if (!transport) {
                    errBack();
                    return;
                }
                const consumerParametersArr = [];
                for (const theirPeerId of Object.keys(state)) {
                    const peerState = state[theirPeerId];
                    if (theirPeerId === myPeerId || !peerState || !peerState.producer) {
                        continue;
                    }
                    try {
                        const { producer } = peerState;
                        consumerParametersArr.push(yield (0, createConsumer_1.createConsumer)(router, producer, rtpCapabilities, transport, myPeerId, state[theirPeerId]));
                    }
                    catch (e) {
                        errLog(e.message);
                        continue;
                    }
                }
                send({
                    op: "@get-recv-tracks-done",
                    uid,
                    d: { consumerParametersArr, roomId },
                });
            }),
            ["@send-track"]: ({ roomId, transportId, direction, peerId: myPeerId, kind, rtpParameters, rtpCapabilities, paused, appData, }, uid, send, errBack) => __awaiter(this, void 0, void 0, function* () {
                var _c;
                if (!(roomId in rooms)) {
                    errBack();
                    return;
                }
                const { state } = rooms[roomId];
                const { sendTransport, producer: previousProducer, consumers, } = state[myPeerId];
                const transport = sendTransport;
                if (!transport) {
                    errBack();
                    return;
                }
                try {
                    if (previousProducer) {
                        previousProducer.close();
                        consumers.forEach((c) => c.close());
                        send({
                            rid: roomId,
                            op: "close_consumer",
                            d: { producerId: previousProducer.id, roomId },
                        });
                    }
                    const producer = yield transport.produce({
                        kind,
                        rtpParameters,
                        paused,
                        appData: Object.assign(Object.assign({}, appData), { peerId: myPeerId, transportId }),
                    });
                    rooms[roomId].state[myPeerId].producer = producer;
                    for (const theirPeerId of Object.keys(state)) {
                        if (theirPeerId === myPeerId) {
                            continue;
                        }
                        const peerTransport = (_c = state[theirPeerId]) === null || _c === void 0 ? void 0 : _c.recvTransport;
                        if (!peerTransport) {
                            continue;
                        }
                        try {
                            const d = yield (0, createConsumer_1.createConsumer)(rooms[roomId].router, producer, rtpCapabilities, peerTransport, myPeerId, state[theirPeerId]);
                            send({
                                uid: theirPeerId,
                                op: "new-peer-speaker",
                                d: Object.assign(Object.assign({}, d), { roomId }),
                            });
                        }
                        catch (e) {
                            errLog(e.message);
                        }
                    }
                    send({
                        op: `@send-track-${direction}-done`,
                        uid,
                        d: {
                            id: producer.id,
                            roomId,
                        },
                    });
                }
                catch (e) {
                    send({
                        op: `@send-track-${direction}-done`,
                        uid,
                        d: {
                            error: e.message,
                            roomId,
                        },
                    });
                    send({
                        op: "error",
                        d: "error connecting to voice server | " + e.message,
                        uid,
                    });
                    return;
                }
            }),
            ["@connect-transport"]: ({ roomId, dtlsParameters, peerId, direction }, uid, send, errBack) => __awaiter(this, void 0, void 0, function* () {
                var _d;
                if (!((_d = rooms[roomId]) === null || _d === void 0 ? void 0 : _d.state[peerId])) {
                    errBack();
                    return;
                }
                const { state } = rooms[roomId];
                const transport = direction === "recv"
                    ? state[peerId].recvTransport
                    : state[peerId].sendTransport;
                if (!transport) {
                    errBack();
                    return;
                }
                log("connect-transport", peerId, transport.appData);
                try {
                    yield transport.connect({ dtlsParameters });
                }
                catch (e) {
                    console.log(e);
                    send({
                        op: `@connect-transport-${direction}-done`,
                        uid,
                        d: { error: e.message, roomId },
                    });
                    send({
                        op: "error",
                        d: "error connecting to voice server | " + e.message,
                        uid,
                    });
                    return;
                }
                send({
                    op: `@connect-transport-${direction}-done`,
                    uid,
                    d: { roomId },
                });
            }),
            ["create-room"]: ({ roomId }, uid, send) => __awaiter(this, void 0, void 0, function* () {
                if (!(roomId in rooms)) {
                    rooms[roomId] = createRoom();
                }
                send({ op: "room-created", d: { roomId }, uid });
            }),
            ["add-speaker"]: ({ roomId, peerId }, uid, send, errBack) => __awaiter(this, void 0, void 0, function* () {
                var _e, _f;
                if (!((_e = rooms[roomId]) === null || _e === void 0 ? void 0 : _e.state[peerId])) {
                    errBack();
                    return;
                }
                log("add-speaker", peerId);
                const { router } = rooms[roomId];
                const sendTransport = yield (0, createTransport_1.createTransport)("send", router, peerId);
                (_f = rooms[roomId].state[peerId].sendTransport) === null || _f === void 0 ? void 0 : _f.close();
                rooms[roomId].state[peerId].sendTransport = sendTransport;
                send({
                    op: "you-are-now-a-speaker",
                    d: {
                        sendTransportOptions: (0, createTransport_1.transportToOptions)(sendTransport),
                        roomId,
                    },
                    uid,
                });
            }),
            ["join-as-speaker"]: ({ roomId, peerId }, uid, send) => __awaiter(this, void 0, void 0, function* () {
                if (!(roomId in rooms)) {
                    rooms[roomId] = createRoom();
                }
                log("join-as-new-peer", peerId);
                const { state, router } = rooms[roomId];
                const [recvTransport, sendTransport] = yield Promise.all([
                    (0, createTransport_1.createTransport)("recv", router, peerId),
                    (0, createTransport_1.createTransport)("send", router, peerId),
                ]);
                if (state[peerId]) {
                    (0, closePeer_1.closePeer)(state[peerId]);
                }
                rooms[roomId].state[peerId] = {
                    recvTransport: recvTransport,
                    sendTransport: sendTransport,
                    consumers: [],
                    producer: null,
                };
                send({
                    op: "you-joined-as-speaker",
                    d: {
                        roomId,
                        peerId,
                        routerRtpCapabilities: rooms[roomId].router.rtpCapabilities,
                        recvTransportOptions: (0, createTransport_1.transportToOptions)(recvTransport),
                        sendTransportOptions: (0, createTransport_1.transportToOptions)(sendTransport),
                    },
                    uid,
                });
            }),
            ["join-as-new-peer"]: ({ roomId, peerId }, uid, send) => __awaiter(this, void 0, void 0, function* () {
                if (!(roomId in rooms)) {
                    rooms[roomId] = createRoom();
                }
                log("join-as-new-peer", peerId);
                const { state, router } = rooms[roomId];
                const recvTransport = yield (0, createTransport_1.createTransport)("recv", router, peerId);
                if (state[peerId]) {
                    (0, closePeer_1.closePeer)(state[peerId]);
                }
                rooms[roomId].state[peerId] = {
                    recvTransport,
                    consumers: [],
                    producer: null,
                    sendTransport: null,
                };
                send({
                    op: "you-joined-as-peer",
                    d: {
                        roomId,
                        peerId,
                        routerRtpCapabilities: rooms[roomId].router.rtpCapabilities,
                        recvTransportOptions: (0, createTransport_1.transportToOptions)(recvTransport),
                    },
                    uid,
                });
            }),
        });
    });
}
exports.main = main;
//# sourceMappingURL=main.js.map
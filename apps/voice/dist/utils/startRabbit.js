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
exports.startRabbit = exports.send = void 0;
const amqplib_1 = __importDefault(require("amqplib"));
const Sentry = __importStar(require("@sentry/node"));
const retryInterval = 5000;
let send = (_obj) => { };
exports.send = send;
const startRabbit = (handler) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("trying to connect to: ", process.env.RABBITMQ_URL || "amqp://localhost");
    let conn;
    try {
        conn = yield amqplib_1.default.connect(process.env.RABBITMQ_URL || "amqp://localhost");
    }
    catch (err) {
        console.error("Unable to connect to RabbitMQ: ", err);
        setTimeout(() => __awaiter(void 0, void 0, void 0, function* () { return yield (0, exports.startRabbit)(handler); }), retryInterval);
        return;
    }
    const id = process.env.QUEUE_ID || "";
    console.log("rabbit connected " + id);
    conn.on("close", function (err) {
        return __awaiter(this, void 0, void 0, function* () {
            console.error("Rabbit connection closed with error: ", err);
            setTimeout(() => __awaiter(this, void 0, void 0, function* () { return yield (0, exports.startRabbit)(handler); }), retryInterval);
        });
    });
    const channel = yield conn.createChannel();
    const onlineQueue = "online_queue" + id;
    const sendQueue = "send_queue" + id;
    const receiveQueue = "receive_queue" + id;
    console.log(sendQueue, onlineQueue, receiveQueue);
    yield Promise.all([
        channel.assertQueue(receiveQueue),
        channel.assertQueue(sendQueue),
        channel.assertQueue(onlineQueue),
    ]);
    exports.send = (obj) => {
        channel.sendToQueue(sendQueue, Buffer.from(JSON.stringify(obj)));
    };
    yield channel.purgeQueue(receiveQueue);
    yield channel.consume(receiveQueue, (e) => __awaiter(void 0, void 0, void 0, function* () {
        const m = e === null || e === void 0 ? void 0 : e.content.toString();
        if (m) {
            let data;
            try {
                data = JSON.parse(m);
            }
            catch (_a) { }
            if (data && data.op && data.op in handler) {
                const { d: handlerData, op: operation, uid } = data;
                try {
                    console.log(operation);
                    yield handler[operation](handlerData, uid, exports.send, () => {
                        console.log(operation);
                        (0, exports.send)({
                            op: "error",
                            d: "The voice server is probably redeploying, it should reconnect in a few seconds. If not, try refreshing.",
                            uid: uid,
                        });
                    });
                }
                catch (err) {
                    console.log(operation, err);
                    Sentry.captureException(err, { extra: { op: operation } });
                }
            }
        }
    }), { noAck: true });
    channel.sendToQueue(onlineQueue, Buffer.from(JSON.stringify({ op: "online" })));
});
exports.startRabbit = startRabbit;
//# sourceMappingURL=startRabbit.js.map
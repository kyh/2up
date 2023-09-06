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
Object.defineProperty(exports, "__esModule", { value: true });
exports.createConsumer = void 0;
const createConsumer = (router, producer, rtpCapabilities, transport, peerId, peerConsuming) => __awaiter(void 0, void 0, void 0, function* () {
    if (!router.canConsume({ producerId: producer.id, rtpCapabilities })) {
        throw new Error(`recv-track: client cannot consume ${producer.appData.peerId}`);
    }
    const consumer = yield transport.consume({
        producerId: producer.id,
        rtpCapabilities,
        paused: false,
        appData: { peerId, mediaPeerId: producer.appData.peerId },
    });
    peerConsuming.consumers.push(consumer);
    return {
        peerId: producer.appData.peerId,
        consumerParameters: {
            producerId: producer.id,
            id: consumer.id,
            kind: consumer.kind,
            rtpParameters: consumer.rtpParameters,
            type: consumer.type,
            producerPaused: consumer.producerPaused,
        },
    };
});
exports.createConsumer = createConsumer;
//# sourceMappingURL=createConsumer.js.map
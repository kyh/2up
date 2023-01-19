"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.closePeer = void 0;
const closePeer = (state) => {
    var _a, _b, _c;
    (_a = state.producer) === null || _a === void 0 ? void 0 : _a.close();
    (_b = state.recvTransport) === null || _b === void 0 ? void 0 : _b.close();
    (_c = state.sendTransport) === null || _c === void 0 ? void 0 : _c.close();
    state.consumers.forEach((c) => c.close());
};
exports.closePeer = closePeer;
//# sourceMappingURL=closePeer.js.map
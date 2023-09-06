"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteRoom = void 0;
const deleteRoom = (roomId, rooms) => {
    if (!(roomId in rooms)) {
        return;
    }
    delete rooms[roomId];
};
exports.deleteRoom = deleteRoom;
//# sourceMappingURL=deleteRoom.js.map
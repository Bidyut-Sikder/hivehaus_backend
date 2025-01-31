"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SlotModal = exports.slotSchema = void 0;
const mongoose_1 = require("mongoose");
exports.slotSchema = new mongoose_1.Schema({
    room: {
        type: mongoose_1.Schema.Types.ObjectId,
        required: true,
        ref: "Room",
    },
    date: { type: String, required: true },
    startTime: { type: String, required: true },
    endTime: { type: String, required: true },
    isBooked: { type: Boolean, default: false },
    isDeleted: { type: Boolean, default: false },
});
exports.SlotModal = (0, mongoose_1.model)("Slot", exports.slotSchema);

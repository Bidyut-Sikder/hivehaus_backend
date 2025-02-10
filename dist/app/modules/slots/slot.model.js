"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SlotModal = exports.slotSchema = void 0;
const mongoose_1 = require("mongoose");
exports.slotSchema = new mongoose_1.Schema({
    // export const slotSchema = new Schema<TSlot>({
    room: {
        type: mongoose_1.Schema.Types.ObjectId,
        required: true,
        ref: "Room",
    },
    date: { type: String, required: true },
    startTime: { type: Number, required: true },
    // startTime: { type: String, required: true },
    endTime: { type: Number, required: true },
    // endTime: { type: String, required: true },
    isBooked: { type: Boolean, default: true },
    isDeleted: { type: Boolean, default: false },
});
exports.SlotModal = (0, mongoose_1.model)("Slot", exports.slotSchema);
// export const SlotModal = model<TSlot>("Slot", slotSchema);

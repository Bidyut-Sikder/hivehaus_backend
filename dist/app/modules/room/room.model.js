"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RoomModel = exports.roomSchema = void 0;
const mongoose_1 = require("mongoose");
exports.roomSchema = new mongoose_1.Schema({
    name: { type: String, required: true },
    roomNo: { type: Number, required: true },
    floorNo: { type: Number, required: true },
    capacity: { type: Number, required: true },
    pricePerSlot: { type: Number, required: true },
    image: { type: [String] },
    amenities: { type: [String], required: true },
    isDeleted: { type: Boolean, default: false }
});
exports.RoomModel = (0, mongoose_1.model)("Room", exports.roomSchema);

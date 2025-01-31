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
exports.slotService = void 0;
const http_status_1 = __importDefault(require("http-status"));
const AppError_1 = __importDefault(require("../../errors/AppError"));
const slot_model_1 = require("./slot.model");
const room_model_1 = require("../room/room.model");
const slot_utlis_1 = require("./slot.utlis");
const createCustomSlotService = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const { room, date, startTime, endTime } = payload;
    //1 day = 24 × 60 = 1440 minutes
    const startMinutes = (0, slot_utlis_1.timeMinutes)(startTime);
    const endMinutes = (0, slot_utlis_1.timeMinutes)(endTime);
    const totalDuration = endMinutes - startMinutes;
    if (totalDuration < 0) {
        throw new AppError_1.default(http_status_1.default.NOT_ACCEPTABLE, "End Time must be after start time");
    }
    const roomRecord = yield room_model_1.RoomModel.findById(room);
    if (!roomRecord) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "Room is not found");
    }
    // Check for existing slots that overlap with the given time range
    const overlappingSlots = yield slot_model_1.SlotModal.find({
        room,
        date,
        $or: [{ startTime: { $lt: endTime }, endTime: { $gt: startTime } }],
    });
    if (overlappingSlots.length > 0) {
        throw new AppError_1.default(http_status_1.default.CONFLICT, "A slot already exists for this time range");
    }
    //creates a timeSlot for the room  every 1 hour
    const newTimeSlot = yield slot_model_1.SlotModal.create(payload);
    return newTimeSlot;
});
const createSlotService = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const { room, date, startTime, endTime } = payload;
    //1 day = 24 × 60 = 1440 minutes
    const startMinutes = (0, slot_utlis_1.timeMinutes)(startTime);
    const endMinutes = (0, slot_utlis_1.timeMinutes)(endTime);
    const totalDuration = endMinutes - startMinutes;
    console.log(`Creating slots for room: ${room}, date: ${date}, startTime: ${startTime}, endTime: ${endTime}`);
    console.log(`Start Minutes: ${startMinutes}, End Minutes: ${endMinutes}, Total Duration: ${totalDuration}`);
    if (totalDuration < 0) {
        throw new AppError_1.default(http_status_1.default.NOT_ACCEPTABLE, "End Time must be after start time");
    }
    const roomRecord = yield room_model_1.RoomModel.findById(room);
    if (!roomRecord) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "Room is not found");
    }
    // Check for existing slots that overlap with the given time range
    const overlappingSlots = yield slot_model_1.SlotModal.find({
        room,
        date,
        $or: [{ startTime: { $lt: endTime }, endTime: { $gt: startTime } }],
    });
    if (overlappingSlots.length > 0) {
        throw new AppError_1.default(http_status_1.default.CONFLICT, "A slot already exists for this time range");
    }
    const numberOfSlots = Math.floor(totalDuration) / 60;
    //creates time slot every 1 hour
    const slots = [];
    for (let i = 0; i < numberOfSlots; i++) {
        const slotStartTime = (0, slot_utlis_1.minutesToTime)(startMinutes + i * 60);
        const slotEndTime = (0, slot_utlis_1.minutesToTime)(startMinutes + (i + 2) * 60);
        const slot = {
            room,
            date,
            startTime: slotStartTime,
            endTime: slotEndTime,
        };
        //creates a timeSlot for the room  every 1 hour
        const createdSlot = yield slot_model_1.SlotModal.create(slot);
        slots.push(createdSlot);
    }
    return slots;
});
const getAvailableAllSlotsService = (query) => __awaiter(void 0, void 0, void 0, function* () {
    const { date, roomId } = query;
    const filter = {
        isBooked: false,
        isDeleted: false,
    };
    if (date) {
        filter.date = date;
    }
    if (roomId) {
        filter.room = roomId;
    }
    const result = yield slot_model_1.SlotModal.find(filter).populate("room");
    return result;
});
const updateSlotsService = (id, updateData) => __awaiter(void 0, void 0, void 0, function* () {
    const existingSlot = yield slot_model_1.SlotModal.findById(id);
    if (!existingSlot) {
        throw new Error("Slot not found.");
    }
    if (existingSlot.isBooked) {
        throw new Error("Cannot update a booked slot.");
    }
    if (updateData.startTime && updateData.endTime) {
        const { startTime, endTime } = updateData;
        const conflictingSlots = yield slot_model_1.SlotModal.find({
            room: existingSlot.room,
            date: existingSlot.date,
            _id: { $ne: id },
            $or: [
                {
                    startTime: { $lt: endTime, $gte: startTime },
                },
                {
                    endTime: { $gt: startTime, $lte: endTime },
                },
                {
                    startTime: { $lte: startTime },
                    endTime: { $gte: endTime },
                },
            ],
        });
        if (conflictingSlots.length > 0) {
            throw new Error("Time conflict with another slot.");
        }
    }
    const updatedSlot = yield slot_model_1.SlotModal.findOneAndUpdate({ _id: id }, { startTime: updateData.startTime, endTime: updateData.endTime }, { new: true });
    return updatedSlot;
});
const deleteSlotService = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const existingSlot = yield slot_model_1.SlotModal.findById(id);
    if (!existingSlot) {
        throw new Error("Slot not found.");
    }
    if (existingSlot.isDeleted) {
        throw new Error("Slot is already deleted.");
    }
    const updatedSlot = yield slot_model_1.SlotModal.findByIdAndUpdate(id, { isDeleted: true }, { new: true });
    return updatedSlot;
});
exports.slotService = {
    createCustomSlotService,
    createSlotService,
    getAvailableAllSlotsService,
    updateSlotsService,
    deleteSlotService,
};

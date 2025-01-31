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
exports.BookingService = void 0;
const http_status_1 = __importDefault(require("http-status"));
const AppError_1 = __importDefault(require("../../errors/AppError"));
const auth_model_1 = require("../auth/auth.model");
const room_model_1 = require("../room/room.model");
const slot_model_1 = require("../slots/slot.model");
const booking_model_1 = require("./booking.model");
const booking_aggregation_1 = require("./booking.aggregation");
const mongodb_1 = require("mongodb");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const createBookingService = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const { date, slots, room, user } = payload;
    //  slots data = ["64ae1234ef56", "64ae5678cd34", "64ae7890ab12"];
    // room is the room id
    // user is the user id
    // slots are the timeslots for the room to be booked
    if (!user) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "User not found");
    }
    if (!room) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "Room not found");
    }
    const userRecord = yield auth_model_1.UserModel.findById(user);
    if (!userRecord) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "User not found in database");
    }
    const roomRecord = yield room_model_1.RoomModel.findById(room);
    if (!roomRecord) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "Room not found in database");
    }
    const slotRecords = yield slot_model_1.SlotModal.find({ _id: { $in: slots } });
    //["64ae1234ef56", "64ae5678cd34", "64ae7890ab12"] are the slots aviailable in the database or not
    if (slotRecords.length !== slots.length) {
        // if they are not available in the database
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "Slots not found in the database");
    }
    //if slots created are not related to  the roomid
    const invalidSlots = slotRecords.filter((slot) => !slot.room.equals(room));
    if (invalidSlots.length > 0) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "Slots do not belong to this specified room");
    }
    // console.log(slotRecords)
    slotRecords.forEach((slot) => __awaiter(void 0, void 0, void 0, function* () {
        slot.isBooked = true;
        yield slot_model_1.SlotModal.findByIdAndUpdate({ _id: slot._id }, { $set: { isBooked: true } });
    }));
    const totalAmount = roomRecord.pricePerSlot * slotRecords.length;
    const booking = {
        date,
        slots: slotRecords,
        room: roomRecord,
        user: userRecord,
        totalAmount,
    };
    const createdBooking = yield booking_model_1.BookingModel.create(booking);
    const bookingId = createdBooking._id;
    const transformedOutput = yield (0, booking_aggregation_1.aggreGationPipeline)(bookingId);
    return transformedOutput;
});
const getAdminAllBookingsService = () => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield booking_model_1.BookingModel.find({ isDeleted: { $ne: true } });
    // return result
    const transformedOutput = yield Promise.all(result.map((booking) => __awaiter(void 0, void 0, void 0, function* () {
        const allBookings = yield (0, booking_aggregation_1.aggreGationPipeline)(booking._id);
        return allBookings;
    })));
    return transformedOutput;
});
const getPaymentCompleteBookingsService = () => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield booking_model_1.BookingModel.find({
        isDeleted: { $ne: true },
        paymentStatus: "paid",
    });
    const transformedOutput = yield Promise.all(result.map((booking) => __awaiter(void 0, void 0, void 0, function* () {
        const allBookings = yield (0, booking_aggregation_1.aggreGationPipeline)(booking._id);
        return allBookings;
    })));
    return transformedOutput;
});
const adminUpdateBookingService = (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield booking_model_1.BookingModel.findByIdAndUpdate(id, payload, {
        new: true,
    });
    if (!result) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "Booking not Found");
    }
    return result;
});
const confirmOrRejectBookingStatusService = (id, status) => __awaiter(void 0, void 0, void 0, function* () {
    const validStatuses = ["confirmed", "unconfirmed"];
    if (!validStatuses.includes(status)) {
        return {
            success: false,
            message: "Invalid status. Must be 'confirmed' or 'unconfirmed'",
        };
    }
    // Update the booking status
    const booking = yield booking_model_1.BookingModel.findByIdAndUpdate(id, { isConfirmed: status }, { new: true, runValidators: true });
    if (!booking) {
        return { success: false, message: "Booking not found" };
    }
    const bookingPopulated = yield (0, booking_aggregation_1.aggreGationPipeline)(new mongodb_1.ObjectId(id));
    return {
        success: true,
        message: `Booking ${status} successfully`,
        booking: bookingPopulated,
    };
});
const deleteBookingService = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield booking_model_1.BookingModel.findByIdAndUpdate({ _id: id }, { isDeleted: true }, { new: true }).select("-paymentStatus -__v");
    if (!result) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "Booking not Found");
    }
    return result;
});
//user-booking service
const getUserBookingsService = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const token = payload.split(" ")[1];
    const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET_KEY);
    const { userId } = decoded;
    const result = yield booking_model_1.BookingModel.find({
        user: new mongodb_1.ObjectId(userId),
        paymentStatus: { $ne: "paid" },
    }); //.select("-user");
    const transformedOutput = yield Promise.all(result.map((booking) => __awaiter(void 0, void 0, void 0, function* () {
        const allBookings = yield (0, booking_aggregation_1.aggreGationPipeline)(booking._id, "user");
        return allBookings;
    })));
    // console.log(result);
    return transformedOutput;
});
exports.BookingService = {
    getUserBookingsService,
    createBookingService,
    getAdminAllBookingsService,
    getPaymentCompleteBookingsService,
    adminUpdateBookingService,
    confirmOrRejectBookingStatusService,
    deleteBookingService,
    // getUserBookingsFromDB,
};

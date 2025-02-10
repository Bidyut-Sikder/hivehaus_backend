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
const slot_model_1 = require("../slots/slot.model");
const booking_model_1 = require("./booking.model");
const booking_aggregation_1 = require("./booking.aggregation");
const mongodb_1 = require("mongodb");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const booking_utils_1 = require("./booking.utils");
const getUserPaidBookingsService = (req) => __awaiter(void 0, void 0, void 0, function* () {
    const fulldata = yield booking_model_1.BookingModel.find({
        user: new mongodb_1.ObjectId(req.userId),
        isConfirmed: "confirmed",
    })
        .populate({
        path: "slot",
        select: "-room", // Exclude the `room` field
    })
        .populate({
        path: "room",
    });
    return fulldata;
});
//admin services
const getAdminAllBookingsService = () => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield booking_model_1.BookingModel.find({
        // isDeleted: { $ne: true },
        isConfirmed: "confirmed",
        paymentStatus: "paid",
    });
    // return result
    const transformedOutput = yield Promise.all(result.map((booking) => __awaiter(void 0, void 0, void 0, function* () {
        const allBookings = yield (0, booking_aggregation_1.aggreGationPipeline)(booking._id);
        return allBookings;
    })));
    return transformedOutput;
});
const getAdminBookingByBookingIdService = (req) => __awaiter(void 0, void 0, void 0, function* () {
    const bookingId = req.params.id;
    const booking = yield booking_model_1.BookingModel.findOne({ _id: new mongodb_1.ObjectId(bookingId) });
    const BookingData = yield (0, booking_aggregation_1.aggreGationPipeline)(booking === null || booking === void 0 ? void 0 : booking._id);
    return BookingData;
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
const getUserBookingsByDateService = (req) => __awaiter(void 0, void 0, void 0, function* () {
    // const { startTime, endTime, date, roomId } = req.query;
    const startTime = decodeURIComponent(req.query.startTime);
    const endTime = decodeURIComponent(req.query.endTime);
    const date = decodeURIComponent(req.query.date);
    const start = (0, booking_utils_1.convertTo24HourFormat)(startTime);
    const end = (0, booking_utils_1.convertTo24HourFormat)(endTime);
    //using roomId and date find,startTime, endTime the slots
    function timeToDecimal(time) {
        const [hours, minutes] = time.split(":").map(Number);
        return hours + minutes / 60;
    }
    const localDecimalStart = timeToDecimal(start);
    const localDecimalEnd = timeToDecimal(end);
    const result = yield slot_model_1.SlotModal.findOne({
        room: new mongodb_1.ObjectId(req.query.roomId), // Match the room
        date: date, // Match the booking date
        isDeleted: false, // Ignore deleted bookings
        $or: [
            {
                startTime: { $lt: localDecimalEnd },
                endTime: { $gt: localDecimalStart },
            }, // Check for overlap
        ],
    });
    return result;
});
//my createBookingNew routeservice
const createBookingService = (req) => __awaiter(void 0, void 0, void 0, function* () {
    const { roomId, startTime, endTime, date, pricePerSlot } = req.body;
    if (!roomId || !startTime || !endTime || !date || !pricePerSlot) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "Something went wrong.");
    }
    const userRecord = yield auth_model_1.UserModel.findById(req.userId);
    if (!userRecord) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "User not found in database");
    }
    const timeDifference = (0, booking_utils_1.getTimeDifference)(startTime, endTime);
    const start = (0, booking_utils_1.convertTo24HourFormat)(startTime);
    const end = (0, booking_utils_1.convertTo24HourFormat)(endTime);
    const result = yield slot_model_1.SlotModal.find({
        room: new mongodb_1.ObjectId(roomId),
        date: date,
        startTime: { $lte: start }, // Stored startTime should be before or equal to input start
        endTime: { $gte: end }, // Stored endTime should be after or equal to input end
    });
    if (result.length > 0) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "Slot already booked");
    }
    else {
        const slot = yield slot_model_1.SlotModal.create({
            room: new mongodb_1.ObjectId(roomId),
            startTime: start,
            endTime: end,
            date: date,
        });
        const totalAmount = timeDifference * pricePerSlot;
        const booking = yield booking_model_1.BookingModel.create({
            user: req.userId,
            room: new mongodb_1.ObjectId(roomId),
            startTime: start,
            endTime: end,
            date: date,
            slot: slot._id,
            totalAmount: totalAmount,
        });
    }
    return "transformedOutput";
});
exports.BookingService = {
    // getUserBookingsService,
    // createBookingService,
    getAdminAllBookingsService,
    // getPaymentCompleteBookingsService,
    // adminUpdateBookingService,
    // confirmOrRejectBookingStatusService,
    deleteBookingService,
    getUserBookingsByDateService,
    getUserPaidBookingsService,
    getAdminBookingByBookingIdService,
    // getUserBookingsFromDB,
};

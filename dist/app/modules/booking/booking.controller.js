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
exports.BookingController = void 0;
const TryCatchError_1 = __importDefault(require("../../utils/TryCatchError"));
const booking_services_1 = require("./booking.services");
//admin bookings
const getAdminAllBookings = (0, TryCatchError_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield booking_services_1.BookingService.getAdminAllBookingsService();
    if (result.length === 0) {
        res.status(404).json({
            success: false,
            message: "No Data Found",
            data: result,
        });
    }
    else {
        res.status(200).json({
            success: true,
            message: "All bookings retrieved successfully",
            data: result,
        });
    }
}));
const getAdminBookingByBookingId = (0, TryCatchError_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield booking_services_1.BookingService.getAdminBookingByBookingIdService(req);
    res.status(200).json({
        success: true,
        message: " Booking retrieved successfully",
        data: result,
    });
})
// }
);
const getUserPaidBookings = (0, TryCatchError_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield booking_services_1.BookingService.getUserPaidBookingsService(req);
    if (result.length === 0) {
        res.status(404).json({
            success: false,
            message: "No Data Found",
            data: result,
        });
    }
    else {
        res.status(200).json({
            success: true,
            message: "Paid bookings retrieved successfully",
            data: result,
        });
    }
}));
const deleteBooking = (0, TryCatchError_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield booking_services_1.BookingService.deleteBookingService(req.params.id);
    res.status(200).json({
        success: true,
        message: "Booking deleted successfully",
        data: result,
    });
}));
const getUserAllBookingsByDate = (0, TryCatchError_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield booking_services_1.BookingService.getUserBookingsByDateService(req);
    res.status(200).json({
        success: true,
        message: "User bookings by date retrieved successfully",
        data: result,
    });
}));
exports.BookingController = {
    getAdminAllBookings,
    getAdminBookingByBookingId,
    deleteBooking,
    getUserPaidBookings,
    getUserAllBookingsByDate,
};

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
const createBooking = (0, TryCatchError_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield booking_services_1.BookingService.createBookingService(req.body);
    res.status(200).json({
        success: true,
        message: "Booking created successfully",
        data: result,
    });
}));
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
const getPaidBookings = (0, TryCatchError_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield booking_services_1.BookingService.getPaymentCompleteBookingsService();
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
const updateBooking = (0, TryCatchError_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield booking_services_1.BookingService.adminUpdateBookingService(req.params.id, req.body);
    res.status(200).json({
        success: true,
        message: "Bookings updated successfully",
        data: result,
    });
}));
const confirmOrAndRejectBookingStatus = (0, TryCatchError_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield booking_services_1.BookingService.confirmOrRejectBookingStatusService(req.params.id, req.body.status);
    res.status(200).json({
        success: true,
        message: result.message,
        data: result.booking,
    });
}));
const deleteBooking = (0, TryCatchError_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield booking_services_1.BookingService.deleteBookingService(req.params.id);
    res.status(200).json({
        success: true,
        message: "Booking deleted successfully",
        data: result,
    });
}));
//user-booking controller 
const getUserAllBookings = (0, TryCatchError_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const token = req.headers.authorization;
    const result = yield booking_services_1.BookingService.getUserBookingsService(token);
    if (result.length === 0) {
        res.status(404).json({
            success: false,
            message: 'No Data Found',
            data: result
        });
    }
    else {
        res.status(200).json({
            success: true,
            message: 'User bookings retrieved successfully',
            data: result
        });
    }
}));
exports.BookingController = {
    getUserAllBookings,
    createBooking,
    getAdminAllBookings,
    getPaidBookings,
    updateBooking,
    confirmOrAndRejectBookingStatus,
    deleteBooking,
    // getUserAllBookings,
};

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
exports.PaymentCanceledForBooking = exports.PaymentFailedForBooking = exports.PaymentSuccessForBooking = exports.initiatePaymentForBooking = void 0;
const mongodb_1 = require("mongodb");
const TryCatchError_1 = __importDefault(require("../../utils/TryCatchError"));
const payment_services_1 = require("./payment.services");
const booking_model_1 = require("../booking/booking.model");
const slot_model_1 = require("../slots/slot.model");
exports.initiatePaymentForBooking = (0, TryCatchError_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const paymentResult = yield payment_services_1.paymentServices.processPayment(req, res);
}));
exports.PaymentSuccessForBooking = (0, TryCatchError_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const bookingId = req.params.bookingId;
    const booking = yield booking_model_1.BookingModel.findByIdAndUpdate({ _id: new mongodb_1.ObjectId(bookingId) }, {
        $set: {
            isConfirmed: "confirmed",
            paymentStatus: "paid",
        },
    }, { new: true });
    res.redirect(`http://localhost:5173/success`);
    // res.redirect(302, `http://localhost:5173/success`);
}));
exports.PaymentFailedForBooking = (0, TryCatchError_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const bookingId = req.params.bookingId;
    const booking = yield booking_model_1.BookingModel.findOne({ _id: bookingId });
    if (booking) {
        yield slot_model_1.SlotModal.deleteOne({ _id: new mongodb_1.ObjectId(booking.slot) });
        yield booking_model_1.BookingModel.deleteOne({ _id: new mongodb_1.ObjectId(bookingId) });
    }
    res.redirect(302, `http://localhost:5173/failed`);
}));
exports.PaymentCanceledForBooking = (0, TryCatchError_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const bookingId = req.params.bookingId;
    const booking = yield booking_model_1.BookingModel.findOne({ _id: bookingId });
    if (booking) {
        yield slot_model_1.SlotModal.deleteOne({ _id: new mongodb_1.ObjectId(booking.slot) });
        yield booking_model_1.BookingModel.deleteOne({ _id: new mongodb_1.ObjectId(bookingId) });
    }
    res.redirect(302, `http://localhost:5173/canceled`);
}));

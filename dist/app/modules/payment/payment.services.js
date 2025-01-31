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
exports.paymentServices = void 0;
/* eslint-disable @typescript-eslint/no-explicit-any */
const http_status_1 = __importDefault(require("http-status"));
const AppError_1 = __importDefault(require("../../errors/AppError"));
const booking_model_1 = require("../booking/booking.model");
// @ts-ignore
const sslcommerz_lts_1 = __importDefault(require("sslcommerz-lts"));
const auth_model_1 = require("../auth/auth.model");
const store_id = process.env.STORE_ID;
const store_password = process.env.STORE_PASSWORD;
const sslcommerz = new sslcommerz_lts_1.default(store_id, store_password, false); //use true in production
const BACKEND_API = process.env.BACKEND_API || "https://hotelbooking-app-nmk8.onrender.com";
const FRONTEND_URL = process.env.FRONTEND_URL || "https://hotelbooking-xi.vercel.app";
const processPayment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { bookingId } = req.body;
    const booking = yield booking_model_1.BookingModel.findById(bookingId);
    // @ts-ignore
    const userId = req.userId;
    const userDetails = yield auth_model_1.UserModel.findOne({ _id: userId });
    if (!userDetails) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "User Not found");
    }
    const tranId = `TXN-${Date.now()}`;
    const data = {
        total_amount: booking === null || booking === void 0 ? void 0 : booking.totalAmount,
        currency: "BDT",
        tran_id: tranId, // use unique tran_id for each api call
        success_url: `${BACKEND_API}/api/payments/success/${tranId}`,
        fail_url: `${BACKEND_API}/api/payments/fail/${tranId}`,
        cancel_url: `${BACKEND_API}/api/payments/cancel/${tranId}`,
        ipn_url: `${BACKEND_API}/api/payments/ipn/${tranId}`,
        shipping_method: "No", //if it is (No) we do not need to provide any sipping information.
        product_name: "workspace.",
        product_category: "Reservation",
        product_profile: "general",
        cus_name: userDetails === null || userDetails === void 0 ? void 0 : userDetails.name,
        cus_email: userDetails === null || userDetails === void 0 ? void 0 : userDetails.email,
        cus_phone: userDetails === null || userDetails === void 0 ? void 0 : userDetails.phone,
    };
    try {
        const response = yield sslcommerz.init(data);
        if (response.status === "SUCCESS") {
            res.json({
                paymentUrl: response.GatewayPageURL,
                tranId,
                totalAmount: booking === null || booking === void 0 ? void 0 : booking.totalAmount,
                bookingId,
            });
            //   res.send({ payment_url: response.GatewayPageURL });
        }
        else {
            res.status(500).json({ message: "Failed to initiate payment", response });
        }
    }
    catch (error) {
        res.status(500).json({ message: "Error initiating payment", error });
    }
});
exports.paymentServices = {
    processPayment,
};

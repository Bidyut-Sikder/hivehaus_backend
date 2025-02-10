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
const slot_model_1 = require("../slots/slot.model");
const booking_model_1 = require("../booking/booking.model");
const mongodb_1 = require("mongodb");
// @ts-ignore
const sslcommerz_lts_1 = __importDefault(require("sslcommerz-lts"));
const auth_model_1 = require("../auth/auth.model");
const booking_utils_1 = require("../booking/booking.utils");
const store_id = process.env.STORE_ID;
const store_password = process.env.STORE_PASSWORD;
const sslcommerz = new sslcommerz_lts_1.default(store_id, store_password, false); //use true in production
const BACKEND_API = process.env.BACKEND_API || "https://hotelbooking-app-nmk8.onrender.com";
const FRONTEND_URL = process.env.FRONTEND_URL || "https://hotelbooking-xi.vercel.app";
// const processPayment = async (req: Request, res: Response) => {
//   const { bookingId } = req.body;
//   const booking = await BookingModel.findById(bookingId);
//   // @ts-ignore
//   const userId = req.userId;
//   const userDetails = await UserModel.findOne({ _id: userId });
//   if (!userDetails) {
//     throw new AppError(httpStatus.NOT_FOUND, "User Not found");
//   }
//   const tranId = `TXN-${Date.now()}`;
//   const data = {
//     total_amount: booking?.totalAmount,
//     currency: "BDT",
//     tran_id: tranId, // use unique tran_id for each api call
//     success_url: `${BACKEND_API}/api/payments/success/${tranId}`,
//     fail_url: `${BACKEND_API}/api/payments/fail/${tranId}`,
//     cancel_url: `${BACKEND_API}/api/payments/cancel/${tranId}`,
//     ipn_url: `${BACKEND_API}/api/payments/ipn/${tranId}`,
//     shipping_method: "No", //if it is (No) we do not need to provide any sipping information.
//     product_name: "workspace.",
//     product_category: "Reservation",
//     product_profile: "general",
//     cus_name: userDetails?.name,
//     cus_email: userDetails?.email,
//     cus_phone: userDetails?.phone,
//   };
//   try {
//     const response = await sslcommerz.init(data);
//     if (response.status === "SUCCESS") {
//       res.json({
//         paymentUrl: response.GatewayPageURL,
//         tranId,
//         totalAmount: booking?.totalAmount,
//         bookingId,
//       });
//       //   res.send({ payment_url: response.GatewayPageURL });
//     } else {
//       res.status(500).json({ message: "Failed to initiate payment", response });
//     }
//   } catch (error) {
//     res.status(500).json({ message: "Error initiating payment", error });
//   }
// };
const processPayment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { roomId, startTime, endTime, date, pricePerSlot } = req.body;
    if (!roomId || !startTime || !endTime || !date || !pricePerSlot) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "Something went wrong.");
    }
    const userRecord = yield auth_model_1.UserModel.findById(req.userId);
    if (!userRecord) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "User not found in database");
    }
    const timeDifference = (0, booking_utils_1.getTimeDifference)(startTime, endTime);
    if (timeDifference < 0) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "Negative number is not valid.");
    }
    const start = (0, booking_utils_1.convertTo24HourFormat)(startTime);
    const end = (0, booking_utils_1.convertTo24HourFormat)(endTime);
    function timeToDecimal(time) {
        const [hours, minutes] = time.split(":").map(Number);
        return hours + minutes / 60;
    }
    const localDecimalStart = timeToDecimal(start);
    const localDecimalEnd = timeToDecimal(end);
    const result = yield slot_model_1.SlotModal.find({
        room: new mongodb_1.ObjectId(roomId),
        date: date,
        startTime: { $lte: localDecimalStart }, // Stored startTime should be before or equal to input start
        endTime: { $gte: localDecimalEnd }, // Stored endTime should be after or equal to input end
    });
    // const result = await SlotModal.find({
    //   room: new ObjectId(roomId),
    //   date: date,
    //   startTime: { $lte: start }, // Stored startTime should be before or equal to input start
    //   endTime: { $gte: end }, // Stored endTime should be after or equal to input end
    // });
    if (result.length > 0) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "Slot already booked");
    }
    const slot = yield slot_model_1.SlotModal.create({
        room: new mongodb_1.ObjectId(roomId),
        startTime: localDecimalStart,
        endTime: localDecimalEnd,
        date: date,
    });
    // const slot = await SlotModal.create({
    //   room: new ObjectId(roomId),
    //   startTime: start,
    //   endTime: end,
    //   date: date,
    // });
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
    // @ts-ignore
    const userId = req.userId;
    const userDetails = yield auth_model_1.UserModel.findOne({ _id: userId });
    if (!userDetails) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "User Not found");
    }
    const tranId = `TXN-${Date.now()}`;
    const data = {
        total_amount: totalAmount,
        currency: "BDT",
        tran_id: tranId, // use unique tran_id for each api call
        success_url: `${BACKEND_API}/api/payments/success/${booking._id}`,
        fail_url: `${BACKEND_API}/api/payments/fail/${booking._id}`,
        cancel_url: `${BACKEND_API}/api/payments/cancel/${booking._id}`,
        ipn_url: `${BACKEND_API}/api/payments/ipn/${booking._id}`,
        shipping_method: "No", //if it is (No) we do not need to provide any sipping information.
        product_name: "HiveHaus.",
        product_category: "Reservation",
        product_profile: "general",
        cus_name: userDetails === null || userDetails === void 0 ? void 0 : userDetails.name,
        cus_email: userDetails === null || userDetails === void 0 ? void 0 : userDetails.email,
        cus_phone: userDetails === null || userDetails === void 0 ? void 0 : userDetails.phone,
    };
    try {
        const response = yield sslcommerz.init(data);
        if (response.status === "SUCCESS") {
            res.status(200).json({
                paymentUrl: response.GatewayPageURL,
                tranId,
                totalAmount: booking === null || booking === void 0 ? void 0 : booking.totalAmount,
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

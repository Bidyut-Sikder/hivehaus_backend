"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentRoutes = void 0;
const express_1 = __importDefault(require("express"));
const payment_controller_1 = require("./payment.controller");
const authCheck_1 = __importDefault(require("../../middlewares/authCheck"));
const router = express_1.default.Router();
router.post("/init", (0, authCheck_1.default)("user"), payment_controller_1.initiatePaymentForBooking);
router.post("/success/:bookingId", payment_controller_1.PaymentSuccessForBooking);
router.post("/fail/:bookingId", payment_controller_1.PaymentFailedForBooking);
router.post("/cancel/:bookingId", payment_controller_1.PaymentCanceledForBooking);
exports.PaymentRoutes = router;

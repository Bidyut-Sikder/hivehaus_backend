import express from "express";
import {
  initiatePaymentForBooking,
  PaymentCanceledForBooking,
  PaymentFailedForBooking,
  PaymentSuccessForBooking,
} from "./payment.controller";
import authCheck from "../../middlewares/authCheck";

const router = express.Router();

router.post("/init", authCheck("user"), initiatePaymentForBooking);
router.post("/success/:bookingId", PaymentSuccessForBooking);
router.post("/fail/:bookingId", PaymentFailedForBooking);
router.post("/cancel/:bookingId", PaymentCanceledForBooking);

export const PaymentRoutes = router;

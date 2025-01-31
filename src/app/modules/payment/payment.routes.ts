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
router.post("/success/:tranId", PaymentSuccessForBooking);
router.post("/fail/:tranId", PaymentFailedForBooking);
router.post("/cancel/:tranId", PaymentCanceledForBooking);

export const PaymentRoutes = router;

import express from 'express'
import { initiatePaymentForBooking } from './payment.controller';

const router = express.Router()

router.post('/init', initiatePaymentForBooking);
// router.post("/success/:tranId", initiatePaymentForBooking);
// router.post("/fail/:tranId", initiatePaymentForBooking);
// router.post("/cancel/:tranId", initiatePaymentForBooking);
// router.post("/ipn", initiatePaymentForBooking);

export const PaymentRoutes = router
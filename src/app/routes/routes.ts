import { Router } from "express";
import { authRouter } from "../modules/auth/auth.routes";
import { roomRoutes } from "../modules/room/room.routes";

import { bookingRoutes } from "../modules/booking/booking.routes";
import { PaymentRoutes } from "../modules/payment/payment.routes";

const router = Router();

router.use("/auth", authRouter);
router.use("/rooms", roomRoutes);

router.use("/bookings", bookingRoutes);
router.use("/payments", PaymentRoutes);


export default router;

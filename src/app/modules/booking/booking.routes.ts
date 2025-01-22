import express from "express";

import { bookingValidation } from "./booking.validation";

import requestValidator from "../../middlewares/requestValidator";
import authCheck from "../../middlewares/authCheck";
import { BookingController } from "./booking.controller";

const router = express.Router();

router.post(
  "/",
//   authCheck("user"),
  requestValidator(bookingValidation.zod_createBookingSchema),
  BookingController.createBooking
);

router.get("/",  BookingController.getAdminAllBookings);
// router.get("/", authCheck("admin"), BookingController.getAdminAllBookings);


export const bookingRoutes = router;

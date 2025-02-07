import express from "express";

import { bookingValidation } from "./booking.validation";

import requestValidator from "../../middlewares/requestValidator";
import authCheck from "../../middlewares/authCheck";
import { BookingController } from "./booking.controller";

const router = express.Router();

router.post(
  "/",
  authCheck("user"),
  // requestValidator(bookingValidation.zod_createBookingSchema),
  BookingController.createBooking
);
//admin
router.get("/admin-paid",  authCheck("admin"), BookingController.getAdminAllBookings);
router.get(
  "/admin-paid-booking/:id",
  authCheck("admin"),
  BookingController.getAdminBookingByBookingId
);
// router.get("/", authCheck("admin"), BookingController.getAdminAllBookings);

router.patch(
  "/:id",
  // authCheck('admin'),
  BookingController.updateBooking
);

router.patch(
  "/status/:id",
  authCheck("admin"),
  BookingController.confirmOrAndRejectBookingStatus
);

router.delete("/:id", authCheck("admin"), BookingController.deleteBooking);

///user Booking

router.get(
  "/user-paid",
  authCheck("user"),
  BookingController.getUserPaidBookings
);

router.get(
  "/user-bookings-unpaid",
  authCheck("user"),
  BookingController.getUserAllBookings
);
//////////
router.get(
  "/check-availability",
  // authCheck("user"),
  BookingController.getUserAllBookingsByDate
);
export const bookingRoutes = router;

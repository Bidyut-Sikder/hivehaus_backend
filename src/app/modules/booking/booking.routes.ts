import express from "express";

import authCheck from "../../middlewares/authCheck";
import { BookingController } from "./booking.controller";

const router = express.Router();


//admin booking apis

router.get("/admin-paid",  authCheck("admin"), BookingController.getAdminAllBookings);
router.get(
  "/admin-paid-booking/:id", 
  authCheck("admin"),
  BookingController.getAdminBookingByBookingId
);

router.delete("/:id", authCheck("admin"), BookingController.deleteBooking);



///user Booking
router.get(
  "/user-paid",
  authCheck("user"),
  BookingController.getUserPaidBookings
);


////////// no middleware
router.get(
  "/check-availability",
  BookingController.getUserAllBookingsByDate
);
export const bookingRoutes = router;

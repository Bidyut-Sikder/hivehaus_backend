"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.bookingRoutes = void 0;
const express_1 = __importDefault(require("express"));
const authCheck_1 = __importDefault(require("../../middlewares/authCheck"));
const booking_controller_1 = require("./booking.controller");
const router = express_1.default.Router();
// router.post(
//   "/",
//   authCheck("user"),
//   // requestValidator(bookingValidation.zod_createBookingSchema),
//   BookingController.createBooking
// );
//admin booking apis
router.get("/admin-paid", (0, authCheck_1.default)("admin"), booking_controller_1.BookingController.getAdminAllBookings);
router.get("/admin-paid-booking/:id", (0, authCheck_1.default)("admin"), booking_controller_1.BookingController.getAdminBookingByBookingId);
router.delete("/:id", (0, authCheck_1.default)("admin"), booking_controller_1.BookingController.deleteBooking);
// router.get("/", authCheck("admin"), BookingController.getAdminAllBookings);
// router.patch(
//   "/:id",
//   // authCheck('admin'),
//   BookingController.updateBooking
// );
// router.patch(
//   "/status/:id",
//   authCheck("admin"),
//   BookingController.confirmOrAndRejectBookingStatus
// );
///user Booking
router.get("/user-paid", (0, authCheck_1.default)("user"), booking_controller_1.BookingController.getUserPaidBookings);
// router.get(
//   "/user-bookings-unpaid",
//   authCheck("user"),
//   BookingController.getUserAllBookings
// );
////////// no middleware
router.get("/check-availability", booking_controller_1.BookingController.getUserAllBookingsByDate);
exports.bookingRoutes = router;

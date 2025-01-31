"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.bookingRoutes = void 0;
const express_1 = __importDefault(require("express"));
const booking_validation_1 = require("./booking.validation");
const requestValidator_1 = __importDefault(require("../../middlewares/requestValidator"));
const authCheck_1 = __importDefault(require("../../middlewares/authCheck"));
const booking_controller_1 = require("./booking.controller");
const router = express_1.default.Router();
router.post("/", 
// authCheck("user"),
(0, requestValidator_1.default)(booking_validation_1.bookingValidation.zod_createBookingSchema), booking_controller_1.BookingController.createBooking);
router.get("/", booking_controller_1.BookingController.getAdminAllBookings);
// router.get("/", authCheck("admin"), BookingController.getAdminAllBookings);
router.get("/paid", booking_controller_1.BookingController.getPaidBookings);
router.patch("/:id", 
// authCheck('admin'),
booking_controller_1.BookingController.updateBooking);
router.patch("/status/:id", (0, authCheck_1.default)("admin"), booking_controller_1.BookingController.confirmOrAndRejectBookingStatus);
router.delete("/:id", (0, authCheck_1.default)("admin"), booking_controller_1.BookingController.deleteBooking);
///user Booking
router.get("/user-bookings", (0, authCheck_1.default)("user"), booking_controller_1.BookingController.getUserAllBookings);
exports.bookingRoutes = router;

import { Request, Response } from "express";

import TryCatchError from "../../utils/TryCatchError";
import { BookingService } from "./booking.services";

const createBooking = TryCatchError(async (req: Request, res: Response) => {
  const result = await BookingService.createBookingIntoDB(req.body);

  res.status(200).json({
    success: true,
    message: "Booking created successfully",
    data: result,
  });
});

const getAdminAllBookings = TryCatchError(
  async (req: Request, res: Response) => {
    const result = await BookingService.getAdminAllBookingsFromDB();

    if (result.length === 0) {
      res.status(404).json({
        success: false,
        message: "No Data Found",
        data: result,
      });
    } else {
      res.status(200).json({
        success: true,
        message: "All bookings retrieved successfully",
        data: result,
      });
    }
  }
);


export const BookingController = {
  createBooking,
  getAdminAllBookings,
  // getUserAllBookings,

};

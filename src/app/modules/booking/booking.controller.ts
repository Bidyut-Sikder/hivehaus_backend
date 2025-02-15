import { Request, Response } from "express";

import TryCatchError from "../../utils/TryCatchError";
import { BookingService } from "./booking.services";



//admin bookings
const getAdminAllBookings = TryCatchError(
  async (req: Request, res: Response) => {
    const result = await BookingService.getAdminAllBookingsService();

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
const getAdminBookingByBookingId = TryCatchError(
  async (req: Request, res: Response) => {
    const result = await BookingService.getAdminBookingByBookingIdService(req);


      res.status(200).json({
        success: true,
        message: " Booking retrieved successfully",
        data: result,
      });
    }
  // }
);





const getUserPaidBookings = TryCatchError(async (req: Request, res: Response) => {
  const result = await BookingService.getUserPaidBookingsService(req);

  if (result.length === 0) {
    res.status(404).json({
      success: false,
      message: "No Data Found",
      data: result,
    });
  } else {
    res.status(200).json({
      success: true,
      message: "Paid bookings retrieved successfully",
      data: result,
    });
  }
});



const deleteBooking = TryCatchError(async (req: Request, res: Response) => {
 
  const result = await BookingService.deleteBookingService(req.params.id);

  res.status(200).json({
    success: true,
    message: "Booking deleted successfully",
    data: result,
  });
});



const getUserAllBookingsByDate = TryCatchError(
  async (req: Request, res: Response) => {
    
    const result = await BookingService.getUserBookingsByDateService(req);


    res.status(200).json({
      success: true,
      message: "User bookings by date retrieved successfully",
      data: result,
    });
  }
);

export const BookingController = {

  getAdminAllBookings,
  getAdminBookingByBookingId,
  deleteBooking,
  getUserPaidBookings,
  getUserAllBookingsByDate,


};

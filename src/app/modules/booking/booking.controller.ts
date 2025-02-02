import { Request, Response } from "express";

import TryCatchError from "../../utils/TryCatchError";
import { BookingService } from "./booking.services";

const createBooking = TryCatchError(async (req: Request, res: Response) => {
  const result = await BookingService.createBookingService(req.body);

  res.status(200).json({
    success: true,
    message: "Booking created successfully",
    data: result,
  });
});

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
const getPaidBookings = TryCatchError(async (req: Request, res: Response) => {
  const result = await BookingService.getPaymentCompleteBookingsService();

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

const updateBooking = TryCatchError(async (req: Request, res: Response) => {
  const result = await BookingService.adminUpdateBookingService(
    req.params.id,
    req.body
  );
  res.status(200).json({
    success: true,
    message: "Bookings updated successfully",
    data: result,
  });
});

const confirmOrAndRejectBookingStatus = TryCatchError(
  async (req: Request, res: Response) => {
    const result = await BookingService.confirmOrRejectBookingStatusService(
      req.params.id,
      req.body.status
    );

    res.status(200).json({
      success: true,
      message: result.message,
      data: result.booking,
    });
  }
);

const deleteBooking = TryCatchError(async (req: Request, res: Response) => {
  const result = await BookingService.deleteBookingService(req.params.id);

  res.status(200).json({
    success: true,
    message: "Booking deleted successfully",
    data: result,
  });
});

//user-booking controller
const getUserAllBookings = TryCatchError(
  async (req: Request, res: Response) => {
    const token = req.headers.authorization;
    const result = await BookingService.getUserBookingsService(token);

    if (result.length === 0) {
      res.status(404).json({
        success: false,
        message: "No Data Found",
        data: result,
      });
    } else {
      res.status(200).json({
        success: true,
        message: "User bookings retrieved successfully",
        data: result,
      });
    }
  }
);
const getUserAllBookingsByDate = TryCatchError(
  async (req: Request, res: Response) => {
    
    const result = await BookingService.getUserBookingsByDateService(req);

    if (result.length === 0) {
      res.status(404).json({
        success: false,
        message: "No Data Found",
        data: result,
      });
    } else {
      res.status(200).json({
        success: true,
        message: "User bookings by date retrieved successfully",
        data: result,
      });
    }
  }
);

export const BookingController = {
  getUserAllBookings,
  createBooking,
  getAdminAllBookings,
  getPaidBookings,
  updateBooking,
  confirmOrAndRejectBookingStatus,
  deleteBooking,
  getUserAllBookingsByDate,
  // getUserAllBookings,
};

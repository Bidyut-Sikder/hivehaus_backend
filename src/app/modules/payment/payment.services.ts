/* eslint-disable @typescript-eslint/no-explicit-any */
import httpStatus from "http-status";
import AppError from "../../errors/AppError";
import { SlotModal } from "../slots/slot.model";
import { BookingModel } from "../booking/booking.model";
import { initiatePayment } from "./payment.utils";
import { Request } from "express";

const processPayment = async (bookingIds: string[], user: any) => {
  let totalAmount = 0;
  const bookings = [];

  for (const bookingId of bookingIds) {
    const booking = await BookingModel.findById(bookingId);

    if (!booking) {
      throw new AppError(
        httpStatus.NOT_FOUND,
        `Booking with ID ${bookingId} not found`
      );
    }

    bookings.push(booking);

    totalAmount += booking.totalAmount ?? 0;
  }

  if (totalAmount === 0) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "Total amount is zero. No payment required."
    );
  }

  const transactionId = `TXN-${Date.now()}`;

  const paymentSession = await initiatePayment(
    bookings,
    user,
    transactionId,
    totalAmount
  );

  if (paymentSession.result === "true") {
    for (const booking of bookings) {
      await BookingModel.findByIdAndUpdate(booking._id, {
        paymentStatus: "paid",
        transactionId,
      });

      const slotIds = booking.slots.map((slot) => slot._id);

      await SlotModal.updateMany(
        { _id: { $in: slotIds } },
        { $set: { isBooked: true } }
      );
    }

    return {
      paymentUrl: paymentSession.payment_url,
      transactionId,
      totalAmount,
      bookingIds,
    };
  } else {
    throw new AppError(
      httpStatus.PAYMENT_REQUIRED,
      "Payment initiation failed."
    );
  }
};

const PaymentSuccessForBookingServices = (req:Request) => {};
const PaymentFailedForBookingServices = (req:Request) => {};
const PaymentCanceledForBookingServices = (req:Request) => {};

export const paymentServices = {
  PaymentSuccessForBookingServices,
  processPayment,
  PaymentFailedForBookingServices,
  PaymentCanceledForBookingServices,
};

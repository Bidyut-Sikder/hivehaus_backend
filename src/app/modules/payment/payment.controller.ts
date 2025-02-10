import { Request, Response } from "express";
import { ObjectId } from "mongodb";
import TryCatchError from "../../utils/TryCatchError";
import { paymentServices } from "./payment.services";
import { BookingModel } from "../booking/booking.model";
import { SlotModal } from "../slots/slot.model";

export const initiatePaymentForBooking = TryCatchError(
  async (req: Request, res: Response) => {
    const paymentResult = await paymentServices.processPayment(req, res);
  }
);

export const PaymentSuccessForBooking = TryCatchError(
  async (req: any, res: Response) => {
    const bookingId = req.params.bookingId;

    const booking = await BookingModel.findByIdAndUpdate(
      { _id: new ObjectId(bookingId) },
      {
        $set: {
          isConfirmed: "confirmed",
          paymentStatus: "paid",
        },
      },
      { new: true }
    );

    res.redirect(`${process.env.FRONTEND_URL}/success`);
    // res.redirect(302, `http://localhost:5173/success`);
  }
);

export const PaymentFailedForBooking = TryCatchError(
  async (req: Request, res: Response) => {
    const bookingId = req.params.bookingId;
    const booking = await BookingModel.findOne({ _id: bookingId });

    if (booking) {
      await SlotModal.deleteOne({ _id: new ObjectId(booking.slot) });
      await BookingModel.deleteOne({ _id: new ObjectId(bookingId) });
    }
    res.redirect(`${process.env.FRONTEND_URL}/failed`);

    // res.redirect(302, `http://localhost:5173/failed`);
  }
);
export const PaymentCanceledForBooking = TryCatchError(
  async (req: Request, res: Response) => {
    const bookingId = req.params.bookingId;
    const booking = await BookingModel.findOne({ _id: bookingId });

    if (booking) {
      await SlotModal.deleteOne({ _id: new ObjectId(booking.slot) });
      await BookingModel.deleteOne({ _id: new ObjectId(bookingId) });
    }
    res.redirect(`${process.env.FRONTEND_URL}/canceled`);

    // res.redirect(302, `http://localhost:5173/canceled`);
  }
);

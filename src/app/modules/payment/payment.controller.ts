import { Request, Response } from "express";
import { ObjectId } from "mongodb";
import TryCatchError from "../../utils/TryCatchError";
import { paymentServices } from "./payment.services";
import { BookingModel } from "../booking/booking.model";

export const initiatePaymentForBooking = TryCatchError(
  async (req: Request, res: Response) => {
    const paymentResult = await paymentServices.processPayment(req, res);

    // return res.status(200).json({
    //   success: true,
    //   message: "Payment processed successfully",
    //   data: paymentResult,
    // });
  }
);

export const PaymentSuccessForBooking = TryCatchError(
  async (req: any, res: Response) => {
    const bookingId = req.params.bookingId;
console.log(bookingId)
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
console.log(booking)
    res.redirect(`http://localhost:5173/success`);
    // res.redirect(302, `http://localhost:5173/success`);
  }
);

export const PaymentFailedForBooking = TryCatchError(
  async (req: Request, res: Response) => {
    res.redirect(302, `http://localhost:5173/failed`);
  }
);
export const PaymentCanceledForBooking = TryCatchError(
  async (req: Request, res: Response) => {
    res.redirect(302, `http://localhost:5173/canceled`);
  }
);

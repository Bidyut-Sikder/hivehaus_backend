import { Request, Response } from "express";
import TryCatchError from "../../utils/TryCatchError";
import { paymentServices } from "./payment.services";

export const initiatePaymentForBooking = TryCatchError(
  async (req: Request, res: Response) => {
    const { bookingIds, user } = req.body;

    const paymentResult = await paymentServices.processPayment(
      bookingIds,
      user
    );

    return res.status(200).json({
      success: true,
      message: "Payment processed successfully",
      data: paymentResult,
    });
  }
);

export const PaymentSuccessForBooking = TryCatchError(
  async (req: Request, res: Response) => {
    const { bookingIds, user } = req.body;

    const paymentResult = paymentServices.PaymentSuccessForBookingServices(req);

    return res.status(200).json({
      success: true,
      message: "Payment processed successfully",
      data: paymentResult,
    });
  }
);

export const PaymentFailedForBooking = TryCatchError(
  async (req: Request, res: Response) => {
    const { bookingIds, user } = req.body;

    const paymentResult = paymentServices.PaymentFailedForBookingServices(req);

    return res.status(200).json({
      success: true,
      message: "Payment processed failed",
      data: paymentResult,
    });
  }
);
export const PaymentCanceledForBooking = TryCatchError(
  async (req: Request, res: Response) => {
    const { bookingIds, user } = req.body;

    const paymentResult =
      paymentServices.PaymentCanceledForBookingServices(req);

    return res.status(200).json({
      success: true,
      message: "Payment processed canceled",
      data: paymentResult,
    });
  }
);

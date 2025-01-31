/* eslint-disable @typescript-eslint/no-explicit-any */
import httpStatus from "http-status";
import AppError from "../../errors/AppError";
import { SlotModal } from "../slots/slot.model";
import { BookingModel } from "../booking/booking.model";
import { initiatePayment } from "./payment.utils";
import { Request, Response } from "express";
// @ts-ignore
import SSLCommerz from "sslcommerz-lts";
import { UserModel } from "../auth/auth.model";

const store_id = process.env.STORE_ID;
const store_password = process.env.STORE_PASSWORD;

const sslcommerz = new SSLCommerz(store_id, store_password, false); //use true in production
const BACKEND_API =
  process.env.BACKEND_API || "https://hotelbooking-app-nmk8.onrender.com";
const FRONTEND_URL =
  process.env.FRONTEND_URL || "https://hotelbooking-xi.vercel.app";

const processPayment = async (req: Request, res: Response) => {
  const { bookingId } = req.body;
  const booking = await BookingModel.findById(bookingId);
  // @ts-ignore
  const userId = req.userId;
  const userDetails = await UserModel.findOne({ _id: userId });

  if (!userDetails) {
    throw new AppError(httpStatus.NOT_FOUND, "User Not found");
  }

  const tranId = `TXN-${Date.now()}`;

  const data = {
    total_amount: booking?.totalAmount,
    currency: "BDT",
    tran_id: tranId, // use unique tran_id for each api call
    success_url: `${BACKEND_API}/api/payments/success/${tranId}`,
    fail_url: `${BACKEND_API}/api/payments/fail/${tranId}`,
    cancel_url: `${BACKEND_API}/api/payments/cancel/${tranId}`,
    ipn_url: `${BACKEND_API}/api/payments/ipn/${tranId}`,
    shipping_method: "No", //if it is (No) we do not need to provide any sipping information.
    product_name: "workspace.",
    product_category: "Reservation",
    product_profile: "general",
    cus_name: userDetails?.name,
    cus_email: userDetails?.email,
    cus_phone: userDetails?.phone, 
  };

  try {
    const response = await sslcommerz.init(data);
    if (response.status === "SUCCESS") {
      res.json({
        paymentUrl: response.GatewayPageURL,
        tranId,
        totalAmount: booking?.totalAmount,
        bookingId,
      });
      //   res.send({ payment_url: response.GatewayPageURL });
    } else {
      res.status(500).json({ message: "Failed to initiate payment", response });
    }
  } catch (error) {
    res.status(500).json({ message: "Error initiating payment", error });
  }
};

export const paymentServices = {
  processPayment,
};

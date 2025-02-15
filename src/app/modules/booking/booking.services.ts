import httpStatus from "http-status";
import AppError from "../../errors/AppError";

import { UserModel } from "../auth/auth.model";
import { RoomModel } from "../room/room.model";
import { SlotModal } from "../slots/slot.model";
import { TBooking } from "./booking.interfaces";
import { BookingModel } from "./booking.model";
import { aggreGationPipeline } from "./booking.aggregation";
import { ObjectId } from "mongodb";
import jwt, { JwtPayload } from "jsonwebtoken";
import { convertTo24HourFormat, getTimeDifference } from "./booking.utils";

const getUserPaidBookingsService = async (req: any) => {
  const fulldata = await BookingModel.find({
    user: new ObjectId(req.userId),
    isConfirmed: "confirmed",
  })
    .populate({
      path: "slot",
      select: "-room", // Exclude the `room` field
    })
    .populate({
      path: "room",
    });

  return fulldata;
};
//admin services
const getAdminAllBookingsService = async () => {
  const result = await BookingModel.find({
    // isDeleted: { $ne: true },
    isConfirmed: "confirmed",
    paymentStatus: "paid",
  });
  // return result
  const transformedOutput = await Promise.all(
    result.map(async (booking) => {
      const allBookings = await aggreGationPipeline(booking._id);
      return allBookings;
    })
  );

  return transformedOutput;
};

const getAdminBookingByBookingIdService = async (req: any) => {
  const bookingId = req.params.id;
  const booking = await BookingModel.findOne({ _id: new ObjectId(bookingId) });
  const BookingData = await aggreGationPipeline(booking?._id);

  return BookingData;
};

const getPaymentCompleteBookingsService = async () => {
  const result = await BookingModel.find({
    isDeleted: { $ne: true },
    paymentStatus: "paid",
  });
  const transformedOutput = await Promise.all(
    result.map(async (booking) => {
      const allBookings = await aggreGationPipeline(booking._id);
      return allBookings;
    })
  );
  return transformedOutput;
};

const adminUpdateBookingService = async (
  id: string,
  payload: Partial<TBooking>
) => {
  const result = await BookingModel.findByIdAndUpdate(id, payload, {
    new: true,
  });

  if (!result) {
    throw new AppError(httpStatus.NOT_FOUND, "Booking not Found");
  }
  return result;
};

const confirmOrRejectBookingStatusService = async (
  id: string,
  status: string
) => {
  const validStatuses = ["confirmed", "unconfirmed"];
  if (!validStatuses.includes(status)) {
    return {
      success: false,
      message: "Invalid status. Must be 'confirmed' or 'unconfirmed'",
    };
  }

  // Update the booking status
  const booking = await BookingModel.findByIdAndUpdate(
    id,
    { isConfirmed: status },
    { new: true, runValidators: true }
  );

  if (!booking) {
    return { success: false, message: "Booking not found" };
  }
  const bookingPopulated = await aggreGationPipeline(new ObjectId(id));

  return {
    success: true,
    message: `Booking ${status} successfully`,
    booking: bookingPopulated,
  };
};

const deleteBookingService = async (id: string) => {
  const result = await BookingModel.findByIdAndDelete({
    _id: new ObjectId(id),
  });

  const deleteSlot = await SlotModal.deleteOne({
    _id: new ObjectId(result?.slot),
  });

  // if (result !== null && deleteSlot.deletedCount !== 0) {
  //   throw new AppError(httpStatus.NOT_FOUND, "Booking not Found");
  // }
  // return result;

  if (result !== null && deleteSlot.deletedCount !== 0) {
    return result._id;
  }

  throw new AppError(httpStatus.NOT_FOUND, "Booking not Found");
};

//user-booking service
const getUserBookingsService = async (payload: any) => {
  const token = payload.split(" ")[1];

  const decoded = jwt.verify(
    token,
    process.env.JWT_SECRET_KEY as string
  ) as JwtPayload;

  const { userId } = decoded;
  const result = await BookingModel.find({
    user: new ObjectId(userId),
    paymentStatus: { $ne: "paid" },
  }); //.select("-user");

  const transformedOutput = await Promise.all(
    result.map(async (booking) => {
      const allBookings = await aggreGationPipeline(booking._id, "user");
      return allBookings;
    })
  );

  // console.log(result);
  return transformedOutput;
};

const getUserBookingsByDateService = async (req: any) => {
  // const { startTime, endTime, date, roomId } = req.query;

  const startTime = decodeURIComponent(req.query.startTime);
  const endTime = decodeURIComponent(req.query.endTime);
  const date = decodeURIComponent(req.query.date);

  const start = convertTo24HourFormat(startTime);
  const end = convertTo24HourFormat(endTime);
  //using roomId and date find,startTime, endTime the slots
  function timeToDecimal(time: string) {
    const [hours, minutes] = time.split(":").map(Number);
    return hours + minutes / 60;
  }
  const localDecimalStart = timeToDecimal(start);
  const localDecimalEnd = timeToDecimal(end);

  const result = await SlotModal.findOne({
    room: new ObjectId(req.query.roomId), // Match the room
    date: date, // Match the booking date
    isDeleted: false, // Ignore deleted bookings
    $or: [
      {
        startTime: { $lt: localDecimalEnd },
        endTime: { $gt: localDecimalStart },
      }, // Check for overlap
    ],
  });

  return result;
};

//my createBookingNew routeservice

const createBookingService = async (req: any) => {
  const { roomId, startTime, endTime, date, pricePerSlot } = req.body;

  if (!roomId || !startTime || !endTime || !date || !pricePerSlot) {
    throw new AppError(httpStatus.NOT_FOUND, "Something went wrong.");
  }
  const userRecord = await UserModel.findById(req.userId);

  if (!userRecord) {
    throw new AppError(httpStatus.NOT_FOUND, "User not found in database");
  }

  const timeDifference = getTimeDifference(startTime, endTime);
  const start = convertTo24HourFormat(startTime);
  const end = convertTo24HourFormat(endTime);

  const result = await SlotModal.find({
    room: new ObjectId(roomId),
    date: date,
    startTime: { $lte: start }, // Stored startTime should be before or equal to input start
    endTime: { $gte: end }, // Stored endTime should be after or equal to input end
  });

  if (result.length > 0) {
    throw new AppError(httpStatus.BAD_REQUEST, "Slot already booked");
  } else {
    const slot = await SlotModal.create({
      room: new ObjectId(roomId),
      startTime: start,
      endTime: end,
      date: date,
    });
    const totalAmount = timeDifference * pricePerSlot;

    const booking = await BookingModel.create({
      user: req.userId,
      room: new ObjectId(roomId),
      startTime: start,
      endTime: end,
      date: date,
      slot: slot._id,
      totalAmount: totalAmount,
    });
  }

  return "transformedOutput";
};

export const BookingService = {

  getAdminAllBookingsService,

  deleteBookingService,
  getUserBookingsByDateService,
  getUserPaidBookingsService,
  getAdminBookingByBookingIdService,

};

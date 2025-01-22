import httpStatus from "http-status";
import AppError from "../../errors/AppError";

import { UserModel } from "../auth/auth.model";
import { RoomModel } from "../room/room.model";
import { SlotModal } from "../slots/slot.model";
import { TBooking } from "./booking.interfaces";
import { BookingModel } from "./booking.model";
import { aggreGationPipeline } from "./booking.aggregation";

const createBookingIntoDB = async (payload: TBooking) => {
  const { date, slots, room, user } = payload;
  //  slots data = ["64ae1234ef56", "64ae5678cd34", "64ae7890ab12"];
  // room is the room id
  // user is the user id
  // slots are the timeslots for the room to be booked
  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, "User not found");
  }

  if (!room) {
    throw new AppError(httpStatus.NOT_FOUND, "Room not found");
  }

  const userRecord = await UserModel.findById(user);

  if (!userRecord) {
    throw new AppError(httpStatus.NOT_FOUND, "User not found in database");
  }

  const roomRecord = await RoomModel.findById(room);

  if (!roomRecord) {
    throw new AppError(httpStatus.NOT_FOUND, "Room not found in database");
  }

  const slotRecords = await SlotModal.find({ _id: { $in: slots } });
  //["64ae1234ef56", "64ae5678cd34", "64ae7890ab12"] are the slots aviailable in the database or not
  if (slotRecords.length !== slots.length) {
    // if they are not available in the database
    throw new AppError(httpStatus.NOT_FOUND, "Slots not found in the database");
  }

  //if slots created are not related to  the roomid
  const invalidSlots = slotRecords.filter((slot) => !slot.room.equals(room));
  if (invalidSlots.length > 0) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "Slots do not belong to this specified room"
    );
  }

  // console.log(slotRecords)

  slotRecords.forEach(async (slot) => {
    slot.isBooked = true;
    await SlotModal.findByIdAndUpdate(
      { _id: slot._id },
      { $set: { isBooked: true } }
    );
  });

  const totalAmount = roomRecord.pricePerSlot * slotRecords.length;

  const booking = {
    date,
    slots: slotRecords,
    room: roomRecord,
    user: userRecord,
    totalAmount,
  };

  const createdBooking = await BookingModel.create(booking);
  const bookingId = createdBooking._id;

  const transformedOutput = await aggreGationPipeline(bookingId);
  return transformedOutput;
};

const getAdminAllBookingsFromDB = async () => {
  const result = await BookingModel.find({ isDeleted: { $ne: true } });
  // return result
  const transformedOutput = await Promise.all(
    result.map(async (booking) => {
      const allBookings = await aggreGationPipeline(booking._id);
      return allBookings;
    })
  );

  return transformedOutput;
};
const getPaymentCompleteBookingsFromDB = async () => {
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

export const BookingService = {
  createBookingIntoDB,
  getAdminAllBookingsFromDB,
  getPaymentCompleteBookingsFromDB,
  // getUserBookingsFromDB,
};

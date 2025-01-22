import httpStatus from "http-status";
import AppError from "../../errors/AppError";

import { UserModel } from "../auth/auth.model";
import { RoomModel } from "../room/room.model";
import { SlotModal } from "../slots/slot.model";
import { TBooking } from "./booking.interfaces";
import { BookingModel } from "./booking.model";

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
    // console.log(slot._id)
    await SlotModal.findByIdAndUpdate(
      { _id: slot._id },
      { $set: { isBooked: true } }
    );
  });
  // console.log(slotRecords)

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

  const matching = {
    $match: {
      _id: bookingId, // Replace with your booking ID
    },
  };

  const populateSlots = {
    $lookup: {
      from: "slots", // The name of the slots collection
      localField: "slots", // Field in the booking collection
      foreignField: "_id", // Field in the slots collection
      as: "slotDetails", // The resulting array with slot data
    },
  };
  const populateRoomDetails = {
    $lookup: {
      from: "rooms", // The name of the rooms collection
      localField: "room", // Field in the booking collection
      foreignField: "_id", // Field in the rooms collection
      as: "room", // The resulting array with slot data
    },
  };
  const populateUserDetails = {
    $lookup: {
      from: "users", // The name of the rooms collection
      localField: "user", // Field in the booking collection
      foreignField: "_id", // Field in the rooms collection
      as: "user", // The resulting array with slot data
    },
  };

  const projection = {
    $project: {
      "user.password": 0,
      "room.image": 0,
    },
  };
  const fulldata = await BookingModel.aggregate([
    matching,

    populateSlots,
    populateRoomDetails,
    populateUserDetails,
    projection,
  ]);
  const transformedOutput = {
    ...fulldata[0],
    slots: fulldata[0].slotDetails, // Rename `slotDetails` to `slots`
    room: fulldata[0].room[0], // Get the first room document
    user: fulldata[0].user[0], // Get the first user document
    slotDetails: undefined,
  };

  return transformedOutput;
};

const getAdminAllBookingsFromDB = async () => {
  const result = await BookingModel.find({ isDeleted: { $ne: true } });
// return result
  const transformedOutput = await Promise.all(
    result.map(async (booking) => {
      const bookingId = booking._id;

      const matching = {
        $match: {
          _id: bookingId, // Replace with your booking ID
        },
      };

      const populateSlots = {
        $lookup: {
          from: "slots", // The name of the slots collection
          localField: "slots", // Field in the booking collection
          foreignField: "_id", // Field in the slots collection
          as: "slotDetails", // The resulting array with slot data
        },
      };
      const populateRoomDetails = {
        $lookup: {
          from: "rooms", // The name of the rooms collection
          localField: "room", // Field in the booking collection
          foreignField: "_id", // Field in the rooms collection
          as: "room", // The resulting array with slot data
        },
      };
      const populateUserDetails = {
        $lookup: {
          from: "users", // The name of the rooms collection
          localField: "user", // Field in the booking collection
          foreignField: "_id", // Field in the rooms collection
          as: "user", // The resulting array with slot data
        },
      };

      const projection = {
        $project: {
          "user.password": 0,
          "room.image": 0,
        },
      };
      const fulldata = await BookingModel.aggregate([
        matching,

        populateSlots,
        populateRoomDetails,
        populateUserDetails,
        projection,
      ]);
      const transformation = {
        ...fulldata[0],
        slots: fulldata[0].slotDetails, // Rename `slotDetails` to `slots`
        room: fulldata[0].room[0], // Get the first room document
        user: fulldata[0].user[0], // Get the first user document
        slotDetails: undefined,
      };
      return transformation;
    })
  );

  return transformedOutput;
};


export const BookingService = {
  createBookingIntoDB,
  getAdminAllBookingsFromDB,
  // getUserBookingsFromDB,

};

// const createBookingIntoDB = async (payload: TBooking) => {
//     const { date, slots, room, user } = payload

//     if (!user) {
//         throw new AppError(httpStatus.NOT_FOUND, "User not found")
//     }

//     if (!room) {
//         throw new AppError(httpStatus.NOT_FOUND, "Room not found")
//     }

//     const userRecord = await User.findById(user)

//     if (!userRecord) {
//         throw new AppError(httpStatus.NOT_FOUND, "User not found in database");
//     }

//     const roomRecord = await Room.findById(room)

//     if (!roomRecord) {
//         throw new AppError(httpStatus.NOT_FOUND, "Room not found in database");
//     }

//     const slotRecords = await Slot.find({ _id: { $in: slots } });
//     if (slotRecords.length !== slots.length) {
//         throw new AppError(httpStatus.NOT_FOUND, "Slots not found in the database");
//     }

//     const invalidSlots = slotRecords.filter(slot => !slot.room.equals(room));
//     if (invalidSlots.length > 0) {
//         throw new AppError(httpStatus.BAD_REQUEST, "Slots do not belong to this specified room");
//     }

//     slotRecords.forEach(slot => {
//         slot.isBooked = true;
//     });

//     const totalAmount = roomRecord.pricePerSlot * slotRecords.length
//     const transactionId = `TXN-${Date.now()}`;

//     const booking = {
//         transactionId,
//         date,
//         slots: slotRecords,
//         room: roomRecord,
//         user: userRecord,
//         totalAmount
//     }

//     await Booking.create(booking)

//     for (const slot of slotRecords) {
//         await Slot.findByIdAndUpdate(slot._id, { isBooked: true });
//     }

//     const paymentSession = await initiatePayment(booking)
//     console.log(paymentSession);
//     return paymentSession
// }

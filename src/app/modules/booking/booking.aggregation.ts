import { BookingModel } from "./booking.model";

export const aggreGationPipeline = async (bookingId: any, removeUser?: any) => {
  const matching = {
    $match: {
      _id: bookingId, // Replace with your booking ID
    },
  };

  const populateSlots = {
    $lookup: {
      from: "slots", // The name of the slots collection
      localField: "slot", // Field in the booking collection
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

  // console.log(projections)
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
    slot: fulldata[0].slotDetails[0], // Rename `slotDetails` to `slots`
    room: fulldata[0].room[0], // Get the first room document
    // user: fulldata[0].user[0], // Get the first user document
    user: removeUser ? undefined : fulldata[0].user[0],
    slotDetails: undefined,
  };
  return transformedOutput;
};

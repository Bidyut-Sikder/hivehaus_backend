/* eslint-disable @typescript-eslint/no-explicit-any */
import httpStatus from "http-status";
import AppError from "../../errors/AppError";
import { Types } from 'mongoose';
import { RoomModel } from "./room.model";
import { TRoom } from "./room.interfaces";


const createRoomService = async (payload: TRoom) => {
  const result = await RoomModel.create(payload);
  console.log(result);
  return result;
};

const getRoomsService = async (queryParams: any) => {
  const { search, capacity, price, sort } = queryParams;
  console.log(queryParams);
  const query: any = { isDeleted: false };

  if (search) {
    query.$or = [
      { name: { $regex: search, $options: "i" } },
      // { description: { $regex: search, $options: 'i' } }
    ];
  }

  if (capacity) {
    query.capacity = { $gte: capacity };
  }

  if (price && price.min !== undefined && price.max !== undefined) {
    query.pricePerSlot = { $gte: price.min, $lte: price.max };
  }

  const sortQuery: any = {};
  if (sort === "priceAsc") {
    sortQuery.pricePerSlot = 1;
  } else if (sort === "priceDesc") {
    sortQuery.pricePerSlot = -1;
  }

  const result = await RoomModel.find(query).sort(sortQuery);

  if (result.length === 0) {
    throw new AppError(httpStatus.NOT_FOUND, "No Data Found");
  }

  return result;
};

// const getRoomsFromDB = async () => {
//     const result = await Room.find({ isDeleted: false });

//     if (result.length === 0) {
//         throw new AppError(httpStatus.NOT_FOUND, "No Data Found")
//     }

//     return result
// }

const getRoomByIdService = async (id: string) => {
  // const result = await RoomModel.findOne({ _id: id, isDeleted: false });
  // if (!result) {
  //   throw new AppError(httpStatus.NOT_FOUND, "No Data Found");
  // }
  // return result;
  const matching = {
    $match: {
      _id: new Types.ObjectId(id), // Replace with your booking ID
      isDeleted: false
    },
  };

  const populateSlots = {
    $lookup: {
      from: "slots", // The name of the slots collection
      localField: "_id", // Field in the roommodel collection
      foreignField: "room", // Field in the slots collection
      as: "slots", // The resulting array with slot data
    },
  };
  const filterSlots = {
    $addFields: {
      slots: {
        $filter: {
          input: "$slots",
          as: "slot",
          cond: { $eq: ["$$slot.isBooked", false] },
        },
      },
    },
  };
  const resultt = await RoomModel.aggregate([
    matching,
    populateSlots,
    filterSlots
   
  ]);


  // const result = await RoomModel.findOne({ _id: id, isDeleted: false });
  // if (!result) {
  //   throw new AppError(httpStatus.NOT_FOUND, "No Data Found");
  // }

  return resultt[0];


};

const updateSingleRoomService = async (id: string, payload: Partial<TRoom>) => {
  const result = await RoomModel.findByIdAndUpdate(id, payload, {
    new: true,
    runValidators: true,
  });

  return result;
};

const deleteSingleRoomService = async (id: string) => {
  const result = await RoomModel.deleteOne({ _id: id });
  if (result.deletedCount === 0) {
    throw new AppError(httpStatus.NOT_FOUND, "No Data Found");
  }
  return result;
};

export const RoomService = {
  createRoomService,
  getRoomsService,
  getRoomByIdService,
  updateSingleRoomService,
  deleteSingleRoomService,
};

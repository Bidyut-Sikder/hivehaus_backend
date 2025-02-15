/* eslint-disable @typescript-eslint/no-explicit-any */
import httpStatus from "http-status";
import AppError from "../../errors/AppError";
import { Types } from "mongoose";
import { RoomModel } from "./room.model";
import { TRoom } from "./room.interfaces";
import { uploadToCloudinary } from "./cloudinaryUploader";
import { roomValidation } from "./room.validation";
import { BookingModel } from "../booking/booking.model";
import { SlotModal } from "../slots/slot.model";

const createRoomService = async (req: any) => {
  const {
    name,
    description,
    roomNo,
    capacity,
    pricePerSlot,
    floorNo,
    amenities,
  } = req.body;

  const parsedData = {
    name,
    description,
    roomNo: parseInt(roomNo, 10),
    capacity: parseInt(capacity, 10),
    pricePerSlot: parseFloat(pricePerSlot),
    floorNo: parseInt(floorNo, 10),
    amenities: Array.isArray(amenities) ? amenities : [amenities],
  };

  const result = roomValidation.zod_roomValidationSchema.safeParse({
    body: parsedData,
  });
  // console.log(result.error?.errors)
  if (!result.success) {
    // Optionally, you could return or throw an error here
    throw new Error("Validation failed");
  }

  const imageFiles = req.files as Express.Multer.File[];
  const roomData = req.body;

  const imagesUrls = await uploadToCloudinary(imageFiles);

  roomData.image = imagesUrls;

  const newRoom = await RoomModel.create(roomData);

  return newRoom;
};

const getRoomsService = async (queryParams: any) => {
  const { search, capacity, price, sort } = queryParams;

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

const getRoomByIdService = async (id: string) => {
  const matching = {
    $match: {
      _id: new Types.ObjectId(id), // Replace with your booking ID
      isDeleted: false,
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
  ]);



  return resultt[0];
};

const updateSingleRoomService = async (req: any) => {
  const roomId = req.params.id.toString();

  const updatedRoom = await RoomModel.findOneAndUpdate(
    {
      _id: roomId,
    },
    req.body,
    { new: true }
  );

  if (!updatedRoom) {
    throw new AppError(httpStatus.NOT_FOUND, "No Room Data Found");
  }

  const imageFiles = req.files as Express.Multer.File[];
  const updatedImagesUrls = await uploadToCloudinary(imageFiles);
  updatedRoom.image = [...updatedImagesUrls, ...(updatedRoom?.image || [])];

  await updatedRoom.save();


  return updatedRoom;
};

const deleteSingleRoomService = async (id: string) => {
  const result = await RoomModel.findOne({ _id: id });
  if (!result) {
    throw new AppError(httpStatus.NOT_FOUND, "No Data Found");
  }

  await BookingModel.deleteMany({ room: id });
  await SlotModal.deleteMany({ room: id });
  await RoomModel.deleteOne({ _id: id });
  return result;
};

export const RoomService = {
  createRoomService,
  getRoomsService,
  getRoomByIdService,
  updateSingleRoomService,
  deleteSingleRoomService,
};

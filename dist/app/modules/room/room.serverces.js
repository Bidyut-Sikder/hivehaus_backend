"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RoomService = void 0;
/* eslint-disable @typescript-eslint/no-explicit-any */
const http_status_1 = __importDefault(require("http-status"));
const AppError_1 = __importDefault(require("../../errors/AppError"));
const mongoose_1 = require("mongoose");
const room_model_1 = require("./room.model");
const cloudinaryUploader_1 = require("./cloudinaryUploader");
const room_validation_1 = require("./room.validation");
const booking_model_1 = require("../booking/booking.model");
const slot_model_1 = require("../slots/slot.model");
const createRoomService = (req) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, description, roomNo, capacity, pricePerSlot, floorNo, amenities, } = req.body;
    const parsedData = {
        name,
        description,
        roomNo: parseInt(roomNo, 10),
        capacity: parseInt(capacity, 10),
        pricePerSlot: parseFloat(pricePerSlot),
        floorNo: parseInt(floorNo, 10),
        amenities: Array.isArray(amenities) ? amenities : [amenities],
    };
    const result = room_validation_1.roomValidation.zod_roomValidationSchema.safeParse({
        body: parsedData,
    });
    // console.log(result.error?.errors)
    if (!result.success) {
        // Optionally, you could return or throw an error here
        throw new Error("Validation failed");
    }
    const imageFiles = req.files;
    const roomData = req.body;
    const imagesUrls = yield (0, cloudinaryUploader_1.uploadToCloudinary)(imageFiles);
    roomData.image = imagesUrls;
    const newRoom = yield room_model_1.RoomModel.create(roomData);
    return newRoom;
});
const getRoomsService = (queryParams) => __awaiter(void 0, void 0, void 0, function* () {
    const { search, capacity, price, sort } = queryParams;
    const query = { isDeleted: false };
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
    const sortQuery = {};
    if (sort === "priceAsc") {
        sortQuery.pricePerSlot = 1;
    }
    else if (sort === "priceDesc") {
        sortQuery.pricePerSlot = -1;
    }
    const result = yield room_model_1.RoomModel.find(query).sort(sortQuery);
    if (result.length === 0) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "No Data Found");
    }
    return result;
});
const getRoomByIdService = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const matching = {
        $match: {
            _id: new mongoose_1.Types.ObjectId(id), // Replace with your booking ID
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
    const resultt = yield room_model_1.RoomModel.aggregate([
        matching,
        // populateSlots,
        // filterSlots,
    ]);
    // const result = await RoomModel.findOne({ _id: id, isDeleted: false });
    // if (!result) {
    //   throw new AppError(httpStatus.NOT_FOUND, "No Data Found");
    // }
    return resultt[0];
});
const updateSingleRoomService = (req) => __awaiter(void 0, void 0, void 0, function* () {
    const roomId = req.params.id.toString();
    const updatedRoom = yield room_model_1.RoomModel.findOneAndUpdate({
        _id: roomId,
    }, req.body, { new: true });
    if (!updatedRoom) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "No Room Data Found");
    }
    const imageFiles = req.files;
    const updatedImagesUrls = yield (0, cloudinaryUploader_1.uploadToCloudinary)(imageFiles);
    updatedRoom.image = [...updatedImagesUrls, ...((updatedRoom === null || updatedRoom === void 0 ? void 0 : updatedRoom.image) || [])];
    yield updatedRoom.save();
    // const result = await RoomModel.findByIdAndUpdate(id, payload, {
    //   new: true,
    //   runValidators: true,
    // });
    return updatedRoom;
});
const deleteSingleRoomService = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield room_model_1.RoomModel.findOne({ _id: id });
    if (!result) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "No Data Found");
    }
    yield booking_model_1.BookingModel.deleteMany({ room: id });
    yield slot_model_1.SlotModal.deleteMany({ room: id });
    yield room_model_1.RoomModel.deleteOne({ _id: id });
    return result;
});
exports.RoomService = {
    createRoomService,
    getRoomsService,
    getRoomByIdService,
    updateSingleRoomService,
    deleteSingleRoomService,
};

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
const room_model_1 = require("./room.model");
const createRoomService = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield room_model_1.RoomModel.create(payload);
    console.log(result);
    return result;
});
const getRoomsService = (queryParams) => __awaiter(void 0, void 0, void 0, function* () {
    const { search, capacity, price, sort } = queryParams;
    console.log(queryParams);
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
// const getRoomsFromDB = async () => {
//     const result = await Room.find({ isDeleted: false });
//     if (result.length === 0) {
//         throw new AppError(httpStatus.NOT_FOUND, "No Data Found")
//     }
//     return result
// }
const getRoomByIdService = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield room_model_1.RoomModel.findOne({ _id: id, isDeleted: false });
    if (!result) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "No Data Found");
    }
    return result;
});
const updateSingleRoomService = (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield room_model_1.RoomModel.findByIdAndUpdate(id, payload, {
        new: true,
        runValidators: true,
    });
    return result;
});
const deleteSingleRoomService = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield room_model_1.RoomModel.deleteOne({ _id: id });
    if (result.deletedCount === 0) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "No Data Found");
    }
    return result;
});
exports.RoomService = {
    createRoomService,
    getRoomsService,
    getRoomByIdService,
    updateSingleRoomService,
    deleteSingleRoomService,
};

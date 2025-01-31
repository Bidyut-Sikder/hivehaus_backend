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
exports.RoomController = void 0;
const TryCatchError_1 = __importDefault(require("../../utils/TryCatchError"));
const room_serverces_1 = require("./room.serverces");
const createRoom = (0, TryCatchError_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield room_serverces_1.RoomService.createRoomService(req.body);
    res.status(200).json({
        success: true,
        message: 'Room added successfully',
        data: result
    });
}));
const getRooms = (0, TryCatchError_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield room_serverces_1.RoomService.getRoomsService(req.query);
    if (result.length === 0) {
        res.status(404).json({
            success: false,
            message: 'No Data Found',
            data: result
        });
    }
    else {
        res.status(200).json({
            success: true,
            message: 'Rooms retrieved successfully',
            data: result
        });
    }
}));
const getRoomById = (0, TryCatchError_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(req.params);
    const result = yield room_serverces_1.RoomService.getRoomByIdService(req.params.id);
    res.status(200).json({
        success: true,
        message: 'Rooms retrieved successfully',
        data: result
    });
}));
const updateSingleRoom = (0, TryCatchError_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield room_serverces_1.RoomService.updateSingleRoomService(req.params.id, req.body);
    res.status(200).json({
        success: true,
        message: 'Room updated successfully',
        data: result
    });
}));
const deleteRoom = (0, TryCatchError_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield room_serverces_1.RoomService.deleteSingleRoomService(req.params.id);
    res.status(200).json({
        success: true,
        message: 'Room deleted successfully',
        data: result
    });
}));
exports.RoomController = {
    createRoom,
    getRooms,
    getRoomById,
    updateSingleRoom,
    deleteRoom
};

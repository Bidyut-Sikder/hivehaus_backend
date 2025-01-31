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
exports.slotController = void 0;
const TryCatchError_1 = __importDefault(require("../../utils/TryCatchError"));
const slot_services_1 = require("./slot.services");
const createCustomSlot = (0, TryCatchError_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield slot_services_1.slotService.createCustomSlotService(req.body);
    res.status(200).json({
        success: true,
        message: 'Slots created successfully',
        data: result
    });
}));
const createSlot = (0, TryCatchError_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield slot_services_1.slotService.createSlotService(req.body);
    res.status(200).json({
        success: true,
        message: 'Slots created successfully',
        data: result
    });
}));
const getAvailableAllSlots = (0, TryCatchError_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield slot_services_1.slotService.getAvailableAllSlotsService(req.query);
    res.status(200).json({
        success: true,
        message: 'Available slots retrieved successfully',
        data: result
    });
}));
const updatedSlots = (0, TryCatchError_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield slot_services_1.slotService.updateSlotsService(req.params.id, req.body);
    res.status(200).json({
        success: true,
        message: 'Slot Updated successfully',
        data: result
    });
}));
const deleteSlot = (0, TryCatchError_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield slot_services_1.slotService.deleteSlotService(req.params.id);
    res.status(200).json({
        success: true,
        message: 'Slot Deleted successfully',
        data: result
    });
}));
exports.slotController = {
    createCustomSlot,
    createSlot,
    getAvailableAllSlots,
    updatedSlots,
    deleteSlot
};

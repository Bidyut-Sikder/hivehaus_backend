"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.slotRoutes = void 0;
const express_1 = __importDefault(require("express"));
const slot_controller_1 = require("./slot.controller");
const requestValidator_1 = __importDefault(require("../../middlewares/requestValidator"));
const slot_validation_1 = require("./slot.validation");
const router = express_1.default.Router();
// user books a certain hours timeSlot for the specified room 
router.post('/custom-slots', 
// auth('user'),
(0, requestValidator_1.default)(slot_validation_1.zod_slotValidation.zod_slotValidationSchema), slot_controller_1.slotController.createCustomSlot);
router.post('/', 
// auth('admin'),
(0, requestValidator_1.default)(slot_validation_1.zod_slotValidation.zod_slotValidationSchema), slot_controller_1.slotController.createSlot);
router.get('/availability', slot_controller_1.slotController.getAvailableAllSlots);
// router.patch('/:id',
//     requestValidator(zod_slotValidation.zod_updateSlotValidationSchema),
//     slotController.updatedSlots
// )
// router.delete('/:id',
//     slotController.deleteSlot
// )
exports.slotRoutes = router;

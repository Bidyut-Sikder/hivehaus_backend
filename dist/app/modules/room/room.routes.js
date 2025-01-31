"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.roomRoutes = void 0;
const express_1 = __importDefault(require("express"));
const room_controller_1 = require("./room.controller");
const authCheck_1 = __importDefault(require("../../middlewares/authCheck"));
const requestValidator_1 = __importDefault(require("../../middlewares/requestValidator"));
const room_validation_1 = require("./room.validation");
const router = express_1.default.Router();
router.post("/", (0, authCheck_1.default)("admin"), (0, requestValidator_1.default)(room_validation_1.roomValidation.zod_roomValidationSchema), room_controller_1.RoomController.createRoom);
router.get("/", room_controller_1.RoomController.getRooms);
router.get("/:id", room_controller_1.RoomController.getRoomById);
router.patch("/:id", (0, authCheck_1.default)("admin"), (0, requestValidator_1.default)(room_validation_1.roomValidation.zod_roomUpdateValidationSchema), room_controller_1.RoomController.updateSingleRoom);
router.delete("/:id", (0, authCheck_1.default)("admin"), room_controller_1.RoomController.deleteRoom);
exports.roomRoutes = router;

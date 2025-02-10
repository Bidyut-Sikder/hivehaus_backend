"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.roomRoutes = void 0;
const express_1 = __importDefault(require("express"));
const room_controller_1 = require("./room.controller");
const authCheck_1 = __importDefault(require("../../middlewares/authCheck"));
const cloudinaryUploader_1 = require("./cloudinaryUploader");
const router = express_1.default.Router();
router.post("/", (0, authCheck_1.default)("admin"), cloudinaryUploader_1.upload.array("imageFiles", 6), room_controller_1.RoomController.createRoom);
router.get("/", room_controller_1.RoomController.getRooms);
router.get("/:id", room_controller_1.RoomController.getRoomById);
router.put("/:id", (0, authCheck_1.default)("admin"), cloudinaryUploader_1.upload.array('imageFiles'), room_controller_1.RoomController.updateSingleRoom);
router.delete("/:id", (0, authCheck_1.default)("admin"), room_controller_1.RoomController.deleteRoom);
exports.roomRoutes = router;

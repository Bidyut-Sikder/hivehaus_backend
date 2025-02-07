import express from "express";
import { RoomController } from "./room.controller";

import authCheck from "../../middlewares/authCheck";
import requestValidator from "../../middlewares/requestValidator";
import { roomValidation } from "./room.validation";
import { upload } from "./cloudinaryUploader";

const router = express.Router();

router.post(
  "/",
  authCheck("admin"),
  upload.array("imageFiles", 6),
  // requestValidator(roomValidation.zod_roomValidationSchema),
  RoomController.createRoom
);

router.get("/", RoomController.getRooms);

router.get("/:id", RoomController.getRoomById);

router.put(
  "/:id",
  authCheck("admin"),
  upload.array('imageFiles'),
  // requestValidator(roomValidation.zod_roomUpdateValidationSchema),
  RoomController.updateSingleRoom
);

router.delete("/:id", authCheck("admin"), RoomController.deleteRoom);

export const roomRoutes = router;

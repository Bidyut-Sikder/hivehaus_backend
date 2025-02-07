import express from "express";
import { RoomController } from "./room.controller";

import authCheck from "../../middlewares/authCheck";

import { upload } from "./cloudinaryUploader";

const router = express.Router();

router.post(
  "/",
  authCheck("admin"),
  upload.array("imageFiles", 6),

  RoomController.createRoom
);

router.get("/", RoomController.getRooms);

router.get("/:id", RoomController.getRoomById);

router.put(
  "/:id",
  authCheck("admin"),
  upload.array('imageFiles'),

  RoomController.updateSingleRoom
);

router.delete("/:id", authCheck("admin"), RoomController.deleteRoom);

export const roomRoutes = router;

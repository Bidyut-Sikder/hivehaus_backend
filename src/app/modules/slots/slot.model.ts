
import { Schema, model } from "mongoose";
import { TSlot } from "./slot.interfaces";

export const slotSchema = new Schema<TSlot>({
  room: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: "Room",
  },
  date: { type: String, required: true },
  startTime: { type: String, required: true },
  endTime: { type: String, required: true },
  isBooked: { type: Boolean, default: false },
  isDeleted: { type: Boolean, default: false },
});

export const SlotModal = model<TSlot>("Slot", slotSchema);


import { Schema, model } from "mongoose";
import { TRoom } from "./room.interfaces";


export const roomSchema = new Schema<TRoom>({
    name: { type: String, required: true },
    roomNo: { type: Number, required: true },
    floorNo: { type: Number, required: true },
    capacity: { type: Number, required: true },
    pricePerSlot: { type: Number, required: true },
    image: { type: [String] },
    amenities: { type: [String], required: true },
    isDeleted: { type: Boolean, default: false },
    description: { type: String, required:true }
})

export const RoomModel = model<TRoom>("Room", roomSchema)



import { Types } from "mongoose"

export type TSlot = {
    room: Types.ObjectId;
    date: string;
    startTime: number;
    endTime: number;
    isBooked: boolean;
    isDeleted?: boolean
}